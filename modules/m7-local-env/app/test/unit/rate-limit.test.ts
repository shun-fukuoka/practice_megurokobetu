import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "../../src/rate-limit.js";

function setup(maxFailures = 3) {
  let time = 1_000_000;
  const limiter = createRateLimiter({ maxFailures, windowMs: 60_000, now: () => time });
  return { limiter, advance: (ms: number) => (time += ms) };
}

test("失敗が上限に達するまでは、受け付ける", () => {
  const { limiter } = setup(3);
  limiter.recordFailure("ip");
  limiter.recordFailure("ip");
  assert.equal(limiter.isBlocked("ip"), false);
});

test("失敗が上限に達すると、受け付けなくなる", () => {
  const { limiter } = setup(3);
  for (let i = 0; i < 3; i++) limiter.recordFailure("ip");
  assert.equal(limiter.isBlocked("ip"), true);
  assert.ok(limiter.retryAfterSeconds("ip") > 0);
});

test("時間がたつと、制限が解ける", () => {
  const { limiter, advance } = setup(3);
  for (let i = 0; i < 3; i++) limiter.recordFailure("ip");
  advance(60_001);
  assert.equal(limiter.isBlocked("ip"), false);
});

test("成功したら、失敗の記録が消える", () => {
  const { limiter } = setup(3);
  limiter.recordFailure("ip");
  limiter.recordFailure("ip");
  limiter.reset("ip");
  limiter.recordFailure("ip");
  assert.equal(limiter.isBlocked("ip"), false);
});

test("別の相手（キー）の失敗は、数えない", () => {
  const { limiter } = setup(2);
  limiter.recordFailure("a");
  limiter.recordFailure("a");
  assert.equal(limiter.isBlocked("a"), true);
  assert.equal(limiter.isBlocked("b"), false);
});
