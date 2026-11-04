/**
 * 演習用の、テストユーザーを作る（M9）。ローカルの Supabase だけで使う、架空のユーザー。
 *
 *   npm run seed:users
 *
 * 役割（role）は、サーバー側でだけ書き換えられる情報（app_metadata）に入れる。
 * `npm run db:reset` で、データベースを作り直すと、ユーザーも消えるので、もう一度実行する。
 */

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { loadEnv } from "./load-env.js";

export const TEST_PASSWORD = "practice-pass-123"; // ローカル専用の、演習用の値（本物のパスワードではない）

export const TEST_USERS = [
  { email: "teacher@test.local", role: "teacher" },
  { email: "student@test.local", role: "student" },
] as const;

/** テストユーザーが、いなければ作る。すでにいれば、何もしない。 */
export async function ensureTestUsers(admin: SupabaseClient): Promise<string[]> {
  const messages: string[] = [];
  for (const user of TEST_USERS) {
    const { error } = await admin.auth.admin.createUser({
      email: user.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      app_metadata: { role: user.role },
    });
    if (!error) {
      messages.push(`作成しました: ${user.email}（役割: ${user.role}）`);
    } else if (error.code === "email_exists" || /already|registered/i.test(error.message)) {
      messages.push(`すでにあります: ${user.email}`);
    } else {
      throw new Error(`${user.email} を作れませんでした: ${error.message}`);
    }
  }
  return messages;
}

// このファイルを直接実行したときだけ、実行する（テストから読み込んだときは、実行しない）
const isDirectRun = process.argv[1] !== undefined && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isDirectRun) {
  loadEnv();
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が設定されていません。modules/m7-local-env/SETUP.md の手順 4 を確認してください。");
    process.exit(1);
  }
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  for (const message of await ensureTestUsers(admin)) console.log(message);
  console.log(`パスワードは、どちらも「${TEST_PASSWORD}」です（ローカル専用の、演習用の値）。`);
}
