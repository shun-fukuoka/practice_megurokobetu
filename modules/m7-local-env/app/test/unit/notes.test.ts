import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, renderPage, validateTitle } from "../../src/notes.js";

// ── validateTitle ──────────────────────────────────────────

test("ふつうのタイトルは受け付ける", () => {
  assert.deepEqual(validateTitle("買い物"), { ok: true, title: "買い物" });
});

test("前後の空白は取り除かれる", () => {
  assert.deepEqual(validateTitle("  買い物  "), { ok: true, title: "買い物" });
});

test("空のタイトルは、エラーになる", () => {
  const result = validateTitle("");
  assert.equal(result.ok, false);
});

// ── escapeHtml / renderPage ────────────────────────────────

test("HTML の特殊文字は、置き換えられる", () => {
  assert.equal(escapeHtml(`<b>"A" & 'B'</b>`), "&lt;b&gt;&quot;A&quot; &amp; &#39;B&#39;&lt;/b&gt;");
});

test("画面を作るとき、タイトルの中のタグは、そのまま埋め込まれない（XSS 対策）", () => {
  const html = renderPage([{ id: "1", title: "<script>alert(1)</script>", created_at: "" }]);
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});

test("エラーがあるときだけ、alert が表示される", () => {
  assert.ok(!renderPage([]).includes('role="alert"'));
  assert.ok(renderPage([], "エラー").includes('role="alert"'));
});
