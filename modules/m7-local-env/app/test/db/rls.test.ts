/**
 * データベースのテスト（ローカルの Supabase が起動していることが前提）。
 * M7 の演習 1 で、手で確かめたことを、テストにしたもの。
 *
 * 実行: npm run test:db
 */

import { test, after } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "../../src/load-env.js";

loadEnv();

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  throw new Error(
    "SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY が設定されていません。modules/m7-local-env/SETUP.md の手順 4 を確認してください。",
  );
}

const anon = createClient(url, anonKey);
const admin = createClient(url, serviceKey);

// このテストが作ったメモの印。後片づけで、これだけを消す（他のデータには触れない）。
const marker = `db-test-${Date.now()}`;

after(async () => {
  await admin.from("notes").delete().like("title", `${marker}%`);
});

test("匿名の鍵（anon）で、メモを読める", async () => {
  const { data, error } = await anon.from("notes").select("id").limit(1);
  assert.equal(error, null);
  assert.ok(data && data.length > 0);
});

test("匿名の鍵（anon）では、メモを追加できない（RLS が拒否する）", async () => {
  const { error } = await anon.from("notes").insert({ title: `${marker}-anon` });
  assert.ok(error, "追加が拒否されるはずが、成功してしまった");
  assert.equal(error.code, "42501"); // RLS（権限）による拒否を表す、PostgreSQL のエラーコード
});

test("サーバー用の鍵（service_role）では、メモを追加できる", async () => {
  const { error } = await admin.from("notes").insert({ title: `${marker}-admin` });
  assert.equal(error, null);
});
