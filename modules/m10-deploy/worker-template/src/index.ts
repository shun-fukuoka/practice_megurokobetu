/**
 * 小さな Cloudflare Worker（M10 の演習の題材）。
 *
 *   GET /            あいさつの画面（`?name=太郎` で、名前を変えられる）
 *   GET /health      動作確認用（版を返す）
 *
 * このアプリは、データベースも、秘密も、個人情報も、使わない。
 * 公開されるのは、このコードが返す文面だけ。
 */

import { buildGreeting, escapeHtml, VERSION } from "./greeting.js";

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, version: VERSION });
    }

    if (url.pathname === "/") {
      const greeting = escapeHtml(buildGreeting(url.searchParams.get("name") ?? ""));
      const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Worker</title>
  </head>
  <body>
    <h1>${greeting}</h1>
    <p>版: ${escapeHtml(VERSION)}</p>
  </body>
</html>
`;
      return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    return new Response("見つかりません", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  },
};
