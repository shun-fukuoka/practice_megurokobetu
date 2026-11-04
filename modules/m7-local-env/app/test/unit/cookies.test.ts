import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCookies, serializeCookie } from "../../src/cookies.js";

test("Cookie ヘッダーを、名前と値に分けて読める", () => {
  assert.deepEqual(parseCookies("a=1; b=hello%20world; c=3"), { a: "1", b: "hello world", c: "3" });
});

test("Cookie ヘッダーが無いときは、空になる", () => {
  assert.deepEqual(parseCookies(undefined), {});
  assert.deepEqual(parseCookies(""), {});
});

test("値に「=」が含まれていても、最初の「=」で分ける", () => {
  assert.equal(parseCookies("token=abc=def").token, "abc=def");
});

test("セッションの Cookie には、HttpOnly と SameSite=Lax を付けられる", () => {
  const header = serializeCookie("lab_session", "abc", { httpOnly: true, sameSite: "Lax", path: "/", maxAgeSeconds: 3600 });
  assert.ok(header.includes("HttpOnly"));
  assert.ok(header.includes("SameSite=Lax"));
  assert.ok(header.includes("Max-Age=3600"));
  assert.ok(header.includes("Path=/"));
});

test("オプションを付けなければ、HttpOnly は付かない（JavaScript から読める）", () => {
  const header = serializeCookie("lab_theme", "light");
  assert.ok(!header.includes("HttpOnly"));
});

test("有効期間を 0 にすると、Cookie を消す指定になる", () => {
  assert.ok(serializeCookie("lab_session", "", { maxAgeSeconds: 0 }).includes("Max-Age=0"));
});

test("値は、特殊な文字をエンコードして、組み立てる", () => {
  assert.ok(serializeCookie("x", "a b;c").startsWith("x=a%20b%3Bc"));
});
