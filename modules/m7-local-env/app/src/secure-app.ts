/**
 * ログイン付きのメモ画面（M9 の演習の題材）。M7・M8 の `server.ts`（ログインなし）とは、別のアプリ。
 *
 *   GET  /          メモの一覧（ログインしていなくても見られる）
 *   GET  /login     ログイン画面
 *   POST /login     ログイン（成功すると、セッションの Cookie を発行する）
 *   POST /logout    ログアウト（Cookie を消す）
 *   POST /notes     メモの追加（**講師（teacher）だけ**。ログイン必須）
 *   GET  /unsafe    【演習専用】エスケープしない危険な画面（`--unsafe-demo` で起動したときだけ）
 *
 * 守っていること（すべて、サーバー側で行う。画面の見た目には頼らない）:
 *   ① 認証: セッションの Cookie の中身を、**サーバーが認証の仕組み（Supabase Auth）に確かめる**
 *   ② 認可: 役割（role）は、**確かめたユーザー情報**から取る。画面（フォーム）から送られた値は、信じない
 *   ③ Cookie: HttpOnly（JavaScript から読めない）、SameSite=Lax（他のサイトからの送信に付かない）
 *   ④ ブルートフォース対策: 短時間に何度もログインに失敗したら、受け付けない
 *   ⑤ XSS 対策: 画面に出す文字は、すべてエスケープする
 *   ⑥ ログインの失敗の理由は、「メールアドレスか、パスワードが違う」とだけ伝える
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { parseCookies, serializeCookie } from "./cookies.js";
import { validateTitle, type Note } from "./notes.js";
import { createRateLimiter, type RateLimiter } from "./rate-limit.js";
import {
  renderLoginPage,
  renderMessagePage,
  renderSecurePage,
  renderUnsafePage,
  type ViewUser,
} from "./secure-views.js";

export const SESSION_COOKIE = "lab_session";
export const THEME_COOKIE = "lab_theme";

export type AppOptions = {
  supabaseUrl: string;
  anonKey: string;
  serviceKey: string;
  /** 演習 M9-4 専用の、危険な画面を有効にする */
  unsafeDemo?: boolean;
  /** 1 分間に許す、ログインの失敗の回数 */
  loginMaxFailures?: number;
  /** セッションの Cookie の有効期間（秒） */
  sessionMaxAgeSeconds?: number;
};

function plainClient(url: string, key: string): SupabaseClient {
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function readForm(req: IncomingMessage): Promise<URLSearchParams> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > 10_000) throw new Error("リクエストが大きすぎます");
    chunks.push(chunk as Buffer);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
}

function send(res: ServerResponse, status: number, html: string, headers: Record<string, string | string[]> = {}): void {
  res.writeHead(status, { "content-type": "text/html; charset=utf-8", ...headers });
  res.end(html);
}

function redirect(res: ServerResponse, location: string, headers: Record<string, string | string[]> = {}): void {
  res.writeHead(303, { location, ...headers });
  res.end();
}

export function createApp(options: AppOptions): Server {
  const anon = plainClient(options.supabaseUrl, options.anonKey);
  const admin = plainClient(options.supabaseUrl, options.serviceKey);
  const limiter: RateLimiter = createRateLimiter({
    maxFailures: options.loginMaxFailures ?? 5,
    windowMs: 60_000,
  });
  const maxAge = options.sessionMaxAgeSeconds ?? 3600;

  async function listNotes(): Promise<Note[]> {
    const { data, error } = await anon
      .from("notes")
      .select("id, title, created_at")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  }

  /** Cookie のセッションを、認証の仕組みに確かめる。有効なら、ユーザー情報を返す。 */
  async function currentUser(req: IncomingMessage): Promise<ViewUser | null> {
    const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
    if (!token) return null;
    const { data, error } = await plainClient(options.supabaseUrl, options.anonKey).auth.getUser(token);
    if (error || !data.user) return null;
    const role = data.user.app_metadata?.role;
    return { email: data.user.email ?? "", role: typeof role === "string" ? role : "none" };
  }

  return createServer(async (req, res) => {
    try {
      const url = req.url ?? "/";
      const key = req.socket.remoteAddress ?? "unknown";

      if (req.method === "GET" && url === "/") {
        const user = await currentUser(req);
        const headers: Record<string, string> = {};
        // 比較のための Cookie。HttpOnly ではないので、JavaScript から読める（M9-2・M9-4 で使う）
        if (parseCookies(req.headers.cookie)[THEME_COOKIE] === undefined) {
          headers["set-cookie"] = serializeCookie(THEME_COOKIE, "light", { path: "/", sameSite: "Lax" });
        }
        send(res, 200, renderSecurePage({ notes: await listNotes(), user }), headers);
        return;
      }

      if (req.method === "GET" && url === "/login") {
        send(res, 200, renderLoginPage());
        return;
      }

      if (req.method === "POST" && url === "/login") {
        if (limiter.isBlocked(key)) {
          send(
            res,
            429,
            renderLoginPage("ログインの失敗が続いたため、しばらく受け付けません。時間をおいて、もう一度お試しください。"),
            { "retry-after": String(limiter.retryAfterSeconds(key)) },
          );
          return;
        }
        const form = await readForm(req);
        const email = (form.get("email") ?? "").trim();
        const password = form.get("password") ?? "";
        const { data, error } = await plainClient(options.supabaseUrl, options.anonKey).auth.signInWithPassword({
          email,
          password,
        });
        if (error || !data.session) {
          limiter.recordFailure(key);
          // どちらが違うのかは、伝えない（メールアドレスの存在を、調べられないようにする）
          send(res, 401, renderLoginPage("メールアドレスまたはパスワードが正しくありません。"));
          return;
        }
        limiter.reset(key);
        redirect(res, "/", {
          "set-cookie": serializeCookie(SESSION_COOKIE, data.session.access_token, {
            httpOnly: true,
            sameSite: "Lax",
            path: "/",
            maxAgeSeconds: maxAge,
          }),
        });
        return;
      }

      if (req.method === "POST" && url === "/logout") {
        redirect(res, "/", {
          "set-cookie": serializeCookie(SESSION_COOKIE, "", {
            httpOnly: true,
            sameSite: "Lax",
            path: "/",
            maxAgeSeconds: 0,
          }),
        });
        return;
      }

      if (req.method === "POST" && url === "/notes") {
        // ① 認証: ログインしているか（Cookie を、サーバーが確かめる）
        const user = await currentUser(req);
        if (!user) {
          send(res, 401, renderMessagePage("ログインが必要です", "メモを追加するには、ログインしてください。"));
          return;
        }
        // ② 認可: 役割は、確かめたユーザー情報から取る（フォームの値は、読まない）
        if (user.role !== "teacher") {
          send(res, 403, renderMessagePage("権限がありません", "メモを追加できるのは、講師（teacher）だけです。"));
          return;
        }
        const form = await readForm(req);
        const result = validateTitle(form.get("title") ?? "");
        if (!result.ok) {
          send(res, 400, renderSecurePage({ notes: await listNotes(), user, error: result.error }));
          return;
        }
        const { error } = await admin.from("notes").insert({ title: result.title, body: "" });
        if (error) throw new Error(error.message);
        redirect(res, "/");
        return;
      }

      if (req.method === "GET" && url === "/unsafe" && options.unsafeDemo) {
        send(res, 200, renderUnsafePage(await listNotes()));
        return;
      }

      send(res, 404, renderMessagePage("見つかりません", "このページは、ありません。"));
    } catch (e) {
      console.error(e);
      send(res, 500, renderMessagePage("エラー", "サーバーでエラーが起きました。"));
    }
  });
}
