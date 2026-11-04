# 演習 M8-2: 設定の変更を、テストが検出する

所要時間の目安: 20 分 / 前提: [演習 1](1-unit-test-gap.md)、ローカルの Supabase が起動していて、`.env` が設定済みであること

## 目的

コードではない「設定」（M7 の RLS）の変更も、テストで検出できることを体験する。

## 手順

作業は `modules/m7-local-env/app` の中で行います。

### 0. 記録の Issue を作り、予想を書く

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M8-2`）を作ります。次の予想を、**実行する前に**書いてください。

- `test/db/rls.test.ts` を読み、3 つのテストが、それぞれ何を確かめているかを書く。
- データベースの RLS を無効にすると、3 つのうち、どのテストが失敗するか。

### 1. 始める前の状態で、テストを実行する

```bash
npm run db:reset
npm run test:db
```

「3 pass」になることを確認します。

### 2. RLS を無効にする

Studio の**ポリシーの画面**を開きます（`http://127.0.0.1:55323/project/default/database/policies`）。`notes` の欄にある「**Disable RLS**」を押します（確認の表示が出たら、進めます）。

> Studio の表記は、バージョンによって異なる場合があります。ボタンが見つからないときは、Studio の「SQL Editor」で、次を実行しても同じです。
>
> ```sql
> alter table public.notes disable row level security;
> ```

### 3. テストを実行する

```bash
npm run test:db
```

結果を、記録の Issue のコメントに書きます。どのテストが失敗し、どんなメッセージが出ましたか。

### 4. 考える

- もし、このテストが無かったら、RLS が無効になっていることに、いつ気づけたと思うか。
- このテストは、「RLS が無効にされていない」ことを確かめられる。では、**本番や staging の、実際の設定**も、このテストで確かめられるか。

### 5. 元に戻す

```bash
npm run db:reset
npm run test:db
```

**片づけの確認**: 「3 pass」に戻ること。

## 振り返り

- 「設定をテストする」とは、どういうことか。
- ローカルのテストが通ることと、本番の設定が正しいことは、同じか。

答えは [answers/2-db-test-rls.md](../answers/2-db-test-rls.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
