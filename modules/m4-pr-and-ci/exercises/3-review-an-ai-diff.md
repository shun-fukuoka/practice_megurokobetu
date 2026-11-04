# 演習 M4-3: AI が書いた差分をレビューする

所要時間の目安: 20 分 / 前提: [M2 AI と学ぶ](../../m2-ai-learning/README.md)の「AI を使うときの約束」

## 状況

次の Issue に対して、AI に実装を頼み、下の差分が出てきました。あなたはレビュアーです。

> **Issue**: セッションが無効になった理由が `idle` のとき、テストにその旨のコメントを足したい
> **完了条件**: `modules/m4-pr-and-ci/app/src/session-policy.test.ts` の idle のテストに、コメントを1行追加する
> **範囲**: テストの期待値・本体のコードは変えない

## AI が出した差分

```diff
--- a/modules/m4-pr-and-ci/app/src/session-policy.ts
+++ b/modules/m4-pr-and-ci/app/src/session-policy.ts
@@ export function evaluateSession(
-  if (session === null) {
-    return { valid: false, reason: "missing" };
-  }
+  if (session === null) {
+    return { valid: true };
+  }
@@
--- a/modules/m4-pr-and-ci/app/src/session-policy.test.ts
+++ b/modules/m4-pr-and-ci/app/src/session-policy.test.ts
-test("セッション情報が無いときは無効（閉じる側に倒す）", () => {
-  const status = evaluateSession(null, t0, policy);
-  assert.deepEqual(status, { valid: false, reason: "missing" });
-});
+test.skip("セッション情報が無いときは無効（閉じる側に倒す）", () => {
+  const status = evaluateSession(null, t0, policy);
+  assert.deepEqual(status, { valid: false, reason: "missing" });
+});
@@
 test("操作がないまま idle の上限を超えると無効", () => {
+  // idle の上限を超えたときは、理由が "idle" になる
   const status = evaluateSession(
--- a/modules/m4-pr-and-ci/app/package.json
+++ b/modules/m4-pr-and-ci/app/package.json
@@
   "devDependencies": {
+    "left-pad-ultra": "^1.0.0",
     "@eslint/js": "^10.0.0",
```

## 課題

先に、[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M4-3`）を作ります。

1. この差分の問題点を、**すべて**、記録の Issue の「予想」の欄に書き出してください（時間を決めて、5 分）。
2. 問題ごとに、次を書いてください。
   - 何が問題か
   - 放置すると、何が起きるか
   - 気づくための手がかり
3. この PR は、マージしてよいか。してよくない場合、作者（AI に頼んだ人）に何を伝えるか。

## 振り返り

- CI は、この中のどれを検出できそうか。できなさそうなものはどれか。
- 「テストが通っている」ことは、安全の証明になるか。
- 差分の**ファイル一覧だけ**を見ても気づけたものはどれか。

答えは [answers/3-review-an-ai-diff.md](../answers/3-review-an-ai-diff.md)（先に自分の考えを書いてから）。
