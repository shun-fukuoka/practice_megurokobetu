/**
 * メモ画面の Web サーバー（M8 の E2E テストの対象。M9 で認証を足す）。
 *
 *   GET  /        メモの一覧と、追加フォームを表示する
 *   POST /notes   メモを追加する
 *
 * 起動: npm run dev  →  http://127.0.0.1:3100
 *
 * 鍵の使い分け（M7 で学んだこと）:
 *   - 一覧の表示は、匿名の鍵（anon）。RLS のルールに従う
 *   - 追加は、サーバー用の鍵（service_role）。この鍵は、このサーバーの中だけで使い、
 *     ブラウザには渡さない
 */

import { createServer } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "./load-env.js";
import { renderPage, validateTitle, type Note } from "./notes.js";

loadEnv();

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const port = Number(process.env.PORT ?? 3100);

if (!url || !anonKey || !serviceKey) {
  console.error(
    "SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY が設定されていません。modules/m7-local-env/SETUP.md の手順 4 を確認してください。",
  );
  process.exit(1);
}

const anon = createClient(url, anonKey);
const admin = createClient(url, serviceKey);

async function listNotes(): Promise<Note[]> {
  const { data, error } = await anon
    .from("notes")
    .select("id, title, created_at")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

async function readBody(req: import("node:http").IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > 10_000) throw new Error("リクエストが大きすぎます");
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(renderPage(await listNotes()));
      return;
    }

    if (req.method === "POST" && req.url === "/notes") {
      const form = new URLSearchParams(await readBody(req));
      const result = validateTitle(form.get("title") ?? "");

      if (!result.ok) {
        res.writeHead(400, { "content-type": "text/html; charset=utf-8" });
        res.end(renderPage(await listNotes(), result.error));
        return;
      }

      const { error } = await admin.from("notes").insert({ title: result.title, body: "" });
      if (error) throw new Error(error.message);

      res.writeHead(303, { location: "/" });
      res.end();
      return;
    }

    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("見つかりません");
  } catch (e) {
    console.error(e);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("サーバーでエラーが起きました");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port} で起動しました`);
});
