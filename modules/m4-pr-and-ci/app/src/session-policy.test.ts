import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateSession, type Policy } from "./session-policy.js";

const HOUR = 60 * 60 * 1000;
const policy: Policy = { idleMs: 1 * HOUR, absoluteMs: 8 * HOUR };
const t0 = 1_000_000_000_000;

test("操作の直後は有効", () => {
  const status = evaluateSession({ loginAt: t0, lastActiveAt: t0 }, t0 + 1000, policy);
  assert.deepEqual(status, { valid: true });
});

test("セッション情報が無いときは無効（閉じる側に倒す）", () => {
  const status = evaluateSession(null, t0, policy);
  assert.deepEqual(status, { valid: false, reason: "missing" });
});

test("操作がないまま idle の上限を超えると無効", () => {
  const status = evaluateSession(
    { loginAt: t0, lastActiveAt: t0 },
    t0 + 1 * HOUR + 1,
    policy,
  );
  assert.deepEqual(status, { valid: false, reason: "idle" });
});

test("操作を続けていても、ログインから absolute の上限を超えると無効", () => {
  const status = evaluateSession(
    { loginAt: t0, lastActiveAt: t0 + 8 * HOUR },
    t0 + 8 * HOUR + 1,
    policy,
  );
  assert.deepEqual(status, { valid: false, reason: "absolute" });
});
