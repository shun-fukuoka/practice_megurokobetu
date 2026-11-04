/**
 * ログイン付きアプリ（secure-app）の、統合テスト（M9）。
 * ローカルの Supabase が起動していることが前提。テストユーザーは、テストの中で、必要なら作る。
 *
 * 実行: npm run test:secure
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "../../src/load-env.js";
import { createApp, SESSION_COOKIE } from "../../src/secure-app.js";
import { ensureTestUsers, TEST_PASSWORD } from "../../src/seed-users.js";

loadEnv();

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) {
  throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY が設定されていません。");
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const marker = `sec-test-${Date.now()}`;
const servers: Server[] = [];

async function start(options: { unsafeDemo?: boolean; loginMaxFailures?: number } = {}): Promise<string> {
  const server = createApp({ supabaseUrl: url!, anonKey: anonKey!, serviceKey: serviceKey!, ...options });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  servers.push(server);
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

function form(values: Record<string, string>): RequestInit {
  return {
    method: "POST",
    redirect: "manual",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(values),
  };
}

/** ログインして、セッションの Cookie の値（`lab_session=...`）を返す。 */
async function login(base: string, email: string, password = TEST_PASSWORD): Promise<string> {
  const res = await fetch(`${base}/login`, form({ email, password }));
  assert.equal(res.status, 303, `${email} のログインに失敗しました（${res.status}）`);
  const setCookie = res.headers.get("set-cookie") ?? "";
  const pair = setCookie.split(";")[0] ?? "";
  assert.ok(pair.startsWith(`${SESSION_COOKIE}=`));
  return pair;
}

async function addNote(base: string, cookie: string | null, title: string, extra: Record<string, string> = {}) {
  return fetch(`${base}/notes`, {
    ...form({ title, ...extra }),
    headers: { "content-type": "application/x-www-form-urlencoded", ...(cookie ? { cookie } : {}) },
  });
}

before(async () => {
  await ensureTestUsers(admin);
});

after(async () => {
  await admin.from("notes").delete().like("title", `%${marker}%`);
  for (const s of servers) s.close();
});

// ── ① 認証 ─────────────────────────────────────────

test("ログインしていないと、メモを追加できない（401）", async () => {
  const base = await start();
  const res = await addNote(base, null, `未ログイン ${marker}`);
  assert.equal(res.status, 401);
});

test("改ざんしたセッションの Cookie では、メモを追加できない（401）", async () => {
  const base = await start();
  const cookie = await login(base, "teacher@test.local");
  const tampered = `${cookie.slice(0, -4)}XXXX`;
  const res = await addNote(base, tampered, `改ざん ${marker}`);
  assert.equal(res.status, 401);
});

test("パスワードが違うと、ログインできず、セッションの Cookie も出ない（401）", async () => {
  const base = await start();
  const res = await fetch(`${base}/login`, form({ email: "teacher@test.local", password: "wrong-password" }));
  assert.equal(res.status, 401);
  assert.equal(res.headers.get("set-cookie"), null);
  const body = await res.text();
  assert.ok(body.includes("メールアドレスまたはパスワードが正しくありません"));
});

test("存在しないメールアドレスでも、同じ文言になる（アカウントの有無を、教えない）", async () => {
  const base = await start();
  const res = await fetch(`${base}/login`, form({ email: "nobody@test.local", password: "whatever-123" }));
  assert.equal(res.status, 401);
  assert.ok((await res.text()).includes("メールアドレスまたはパスワードが正しくありません"));
});

// ── ③ Cookie ───────────────────────────────────────

test("セッションの Cookie は、HttpOnly と SameSite=Lax で発行される", async () => {
  const base = await start();
  const res = await fetch(`${base}/login`, form({ email: "teacher@test.local", password: TEST_PASSWORD }));
  assert.equal(res.status, 303);
  const setCookie = res.headers.get("set-cookie") ?? "";
  assert.ok(setCookie.includes("HttpOnly"), setCookie);
  assert.ok(setCookie.includes("SameSite=Lax"), setCookie);
  assert.ok(setCookie.includes("Path=/"), setCookie);
});

test("比較用の lab_theme の Cookie は、HttpOnly ではない", async () => {
  const base = await start();
  const res = await fetch(base);
  const setCookie = res.headers.get("set-cookie") ?? "";
  assert.ok(setCookie.startsWith("lab_theme="), setCookie);
  assert.ok(!setCookie.includes("HttpOnly"), setCookie);
});

test("ログアウトすると、セッションの Cookie を消す指示が出る", async () => {
  const base = await start();
  const res = await fetch(`${base}/logout`, { method: "POST", redirect: "manual" });
  assert.equal(res.status, 303);
  assert.ok((res.headers.get("set-cookie") ?? "").includes("Max-Age=0"));
});

// ── ② 認可 ─────────────────────────────────────────

test("講師（teacher）は、メモを追加できる", async () => {
  const base = await start();
  const cookie = await login(base, "teacher@test.local");
  const res = await addNote(base, cookie, `講師の追加 ${marker}`);
  assert.equal(res.status, 303);
  const page = await (await fetch(base, { headers: { cookie } })).text();
  assert.ok(page.includes(`講師の追加 ${marker}`));
});

test("生徒（student）は、ログインできても、メモを追加できない（403）", async () => {
  const base = await start();
  const cookie = await login(base, "student@test.local");
  const res = await addNote(base, cookie, `生徒の追加 ${marker}`);
  assert.equal(res.status, 403);
});

test("生徒が、フォームに「role=teacher」を足して送っても、役割は変わらない（403）", async () => {
  const base = await start();
  const cookie = await login(base, "student@test.local");
  const res = await addNote(base, cookie, `なりすまし ${marker}`, { role: "teacher" });
  assert.equal(res.status, 403);
});

test("生徒の画面には、追加フォームが出ない", async () => {
  const base = await start();
  const cookie = await login(base, "student@test.local");
  const page = await (await fetch(base, { headers: { cookie } })).text();
  assert.ok(!page.includes('action="/notes"'));
  assert.ok(page.includes("講師（teacher）だけです"));
});

// ── ⑤ XSS ──────────────────────────────────────────

test("タイトルの中の HTML は、画面で、そのまま表示される（実行されない）", async () => {
  const base = await start();
  const cookie = await login(base, "teacher@test.local");
  const title = `<b>x</b>${marker}`;
  assert.equal((await addNote(base, cookie, title)).status, 303);
  const page = await (await fetch(base)).text();
  assert.ok(page.includes(`&lt;b&gt;x&lt;/b&gt;${marker}`));
  assert.ok(!page.includes(`<b>x</b>${marker}`));
});

test("危険な画面（/unsafe）は、通常は無効（404）", async () => {
  const base = await start();
  assert.equal((await fetch(`${base}/unsafe`)).status, 404);
});

test("危険な画面（/unsafe）は、演習用の指定をしたときだけ有効で、エスケープしない", async () => {
  const base = await start({ unsafeDemo: true });
  const cookie = await login(base, "teacher@test.local");
  const title = `<i>y</i>${marker}`;
  assert.equal((await addNote(base, cookie, title)).status, 303);
  const res = await fetch(`${base}/unsafe`);
  assert.equal(res.status, 200);
  assert.ok((await res.text()).includes(`<i>y</i>${marker}`));
});

// ── ④ ブルートフォース対策 ─────────────────────────

test("ログインの失敗が続くと、正しいパスワードでも、しばらく受け付けない（429）", async () => {
  const base = await start({ loginMaxFailures: 3 });
  for (let i = 0; i < 3; i++) {
    const res = await fetch(`${base}/login`, form({ email: "teacher@test.local", password: `wrong-${i}` }));
    assert.equal(res.status, 401);
  }
  const blocked = await fetch(`${base}/login`, form({ email: "teacher@test.local", password: TEST_PASSWORD }));
  assert.equal(blocked.status, 429);
  assert.ok(blocked.headers.get("retry-after"));
});
