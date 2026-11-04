# 演習 M8-4: テストの独立性

所要時間の目安: 20 分 / 前提: [演習 3](3-e2e-run-and-break.md)（片づけの確認まで終えていること）

## 目的

**前のテストの影響を受けるテスト**が、どんな問題を起こすかを体験し、独立したテストの書き方を身につける。

## 手順

作業は `modules/m7-local-env/app` の中で行います。

### 0. 記録の Issue を作り、予想を書く

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M8-4`）を作ります。次の予想を、**実行する前に**書いてください。

初期状態（5 件）のデータベースで、`e2e/notes.spec.ts` の**いちばん下**に、次のテストを足して実行します。

```ts
test("追加すると、一覧が 6 件になる（素朴な版）", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("タイトル").fill(`naive ${Date.now()}`);
  await page.getByRole("button", { name: "追加" }).click();

  await expect(page.getByRole("list", { name: "メモの一覧" }).getByRole("listitem")).toHaveCount(6);
});
```

- このテストは、通ると思うか。失敗すると思うか。その理由は。

### 1. 始める前に、初期状態にする

```bash
npm run db:reset
git status
```

`git status` に変更が出ないことを確認します。

### 2. 素朴なテストを足して、実行する

上のテストを足し、実行します。

```bash
npm run test:e2e
```

結果を、記録の Issue のコメントに書きます。失敗した場合、エラーメッセージの「Expected」と「Received」を読みます。

### 3. 原因を探す

- 期待した件数と、実際の件数は、いくつずつ違うか。
- 同じファイルの、**他のテスト**が、何かしていないか。

### 4. 独立した書き方に直す

素朴なテストを、次の「追加の前後の件数を比べる」形に書き換えます。

```ts
test("追加すると、一覧が 1 件増える", async ({ page }) => {
  await page.goto("/");
  const items = page.getByRole("list", { name: "メモの一覧" }).getByRole("listitem");
  const before = await items.count();

  await page.getByLabel("タイトル").fill(`robust ${Date.now()}`);
  await page.getByRole("button", { name: "追加" }).click();

  await expect(items).toHaveCount(before + 1);
});
```

### 5. 連続で実行する

`npm run db:reset` を**せずに**、2 回続けて実行します。

```bash
npm run test:e2e
npm run test:e2e
```

2 回とも、通りますか。

### 6. 考える

- 素朴なテストが失敗した原因は、何だったか。「どのテストが、何をしたか」で説明する。
- 独立した書き方は、何に依存しなくなったか。
- もし、テストを複数同時に（並列に）実行したら、どうなるか。（`playwright.config.ts` の `workers: 1` の意味を考える）

### 7. 片づけ

書き足したテストは、**削除**して元に戻します（残したい場合は、独立した版のみ）。

```bash
npm run db:reset
```

**片づけの確認**:

```bash
git diff e2e
npm run test:e2e
```

足したテストを削除した場合、`git diff e2e` に何も表示されず、3 件が通ること。

## 振り返り

- 「テストが独立している」とは、どういうことか。
- 「テストの前に `db:reset` する」ことと、「テスト自体を独立させる」ことは、どう違うか。

答えは [answers/4-test-independence.md](../answers/4-test-independence.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
