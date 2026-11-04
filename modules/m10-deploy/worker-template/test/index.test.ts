import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

test("トップページは、200 で、あいさつを返す", async () => {
  const res = await worker.fetch(new Request("http://localhost/"));
  assert.equal(res.status, 200);
  assert.ok((await res.text()).includes("こんにちは、はじめまして！"));
});

test("名前を指定すると、名前入りのあいさつになる", async () => {
  const res = await worker.fetch(new Request("http://localhost/?name=" + encodeURIComponent("花子")));
  assert.ok((await res.text()).includes("こんにちは、花子 さん！"));
});

test("名前の中の HTML は、エスケープされる（XSS 対策）", async () => {
  const res = await worker.fetch(new Request("http://localhost/?name=" + encodeURIComponent("<script>alert(1)</script>")));
  const body = await res.text();
  assert.ok(!body.includes("<script>alert(1)</script>"));
  assert.ok(body.includes("&lt;script&gt;"));
});

test("/health は、ok と版を返す", async () => {
  const res = await worker.fetch(new Request("http://localhost/health"));
  assert.equal(res.status, 200);
  const data = (await res.json()) as { ok: boolean; version: string };
  assert.equal(data.ok, true);
  assert.ok(data.version.length > 0);
});

test("存在しないパスは、404", async () => {
  const res = await worker.fetch(new Request("http://localhost/nothing"));
  assert.equal(res.status, 404);
});
