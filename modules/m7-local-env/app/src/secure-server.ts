/**
 * ログイン付きのメモ画面を起動する（M9）。
 *
 *   npm run dev:secure           通常（安全な画面だけ）   → http://127.0.0.1:3101
 *   npm run dev:secure:unsafe    演習 M9-4 専用（危険な画面 /unsafe も有効）
 *
 * 前提: ローカルの Supabase が起動していて、`.env`（または環境変数）が設定済みで、
 *       `npm run seed:users` で、テスト用のユーザーを作ってあること。
 */

import { createApp } from "./secure-app.js";
import { loadEnv } from "./load-env.js";

loadEnv();

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const port = Number(process.env.PORT_SECURE ?? 3101);
const unsafeDemo = process.argv.includes("--unsafe-demo");

if (!url || !anonKey || !serviceKey) {
  console.error(
    "SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY が設定されていません。modules/m7-local-env/SETUP.md の手順 4 を確認してください。",
  );
  process.exit(1);
}

const server = createApp({ supabaseUrl: url, anonKey, serviceKey, unsafeDemo });

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port} で起動しました${unsafeDemo ? "（演習専用: 危険な画面 /unsafe が有効）" : ""}`);
});
