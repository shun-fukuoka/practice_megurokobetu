/**
 * ローカルの Supabase に接続して、メモの一覧を表示する。
 *
 * 接続先と鍵は、環境変数から受け取る（コードに直接書かない）。
 *   SUPABASE_URL      ローカルの API の URL
 *   SUPABASE_ANON_KEY 匿名の（誰でも使える）公開用の鍵。RLS のルールに従う
 *
 * 値は `npx supabase status -o env` で確認できる（M7 の SETUP.md を参照）。
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error(
    "SUPABASE_URL と SUPABASE_ANON_KEY が設定されていません。modules/m7-local-env/SETUP.md の手順 4 を確認してください。",
  );
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const { data, error } = await supabase
  .from("notes")
  .select("id, title, created_at")
  .order("created_at", { ascending: true });

if (error) {
  console.error("取得に失敗しました:", error.message);
  process.exit(1);
}

console.log(`メモは ${data.length} 件です。`);
for (const note of data) {
  console.log(`- ${note.title}`);
}
