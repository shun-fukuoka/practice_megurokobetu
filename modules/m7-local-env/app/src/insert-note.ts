/**
 * メモを1件追加する。鍵の違い（anon と service_role）を体験するためのスクリプト。
 *
 * 使い方:
 *   npm run insert -- "タイトル"            匿名の鍵（anon）で追加する → RLS のルールに従う
 *   npm run insert -- --admin "タイトル"    サーバー用の鍵（service_role）で追加する → RLS を迂回する
 *
 * 重要: service_role の鍵は、RLS（行レベルセキュリティ）をすべて迂回できる強い鍵。
 * 実際のアプリでは、ブラウザ側のコードには絶対に渡さず、サーバー側だけで使う。
 * ここで使えるのは、自分のパソコンの中のローカル環境だけの鍵。
 */

import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const admin = args.includes("--admin");
const title = args.find((a) => a !== "--admin");

if (!title) {
  console.error('使い方: npm run insert -- [--admin] "タイトル"');
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const key = admin ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    `${admin ? "SUPABASE_SERVICE_ROLE_KEY" : "SUPABASE_ANON_KEY"} または SUPABASE_URL が設定されていません。modules/m7-local-env/SETUP.md の手順 4 を確認してください。`,
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const { error } = await supabase.from("notes").insert({ title, body: "" });

console.log(`使った鍵: ${admin ? "service_role（RLS を迂回する）" : "anon（RLS に従う）"}`);
if (error) {
  console.error(`追加に失敗しました: ${error.message}`);
  process.exit(1);
}
console.log(`追加しました: ${title}`);
