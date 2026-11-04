import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGreeting, escapeHtml } from "../src/greeting.js";

test("名前があれば、名前入りのあいさつになる", () => {
  assert.equal(buildGreeting("太郎"), "こんにちは、太郎 さん！");
});

test("名前が空（または空白だけ）なら、名前なしのあいさつになる", () => {
  assert.equal(buildGreeting(""), "こんにちは、はじめまして！");
  assert.equal(buildGreeting("   "), "こんにちは、はじめまして！");
});

test("HTML の特殊文字は、置き換えられる", () => {
  assert.equal(escapeHtml(`<b>"A" & 'B'</b>`), "&lt;b&gt;&quot;A&quot; &amp; &#39;B&#39;&lt;/b&gt;");
});
