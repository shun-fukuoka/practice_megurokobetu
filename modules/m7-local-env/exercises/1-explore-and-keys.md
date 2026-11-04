# 演習 M7-1: 起動して中を見る／鍵の違い

所要時間の目安: 20 分 / 前提: [SETUP.md](../SETUP.md) を完了していること（Studio の画面の使い方も、SETUP.md にあります）

## 目的

- ローカルのデータベースの中身を、画面で確認する。
- **anon の鍵と service_role の鍵で、できることが違う**ことを体験する。

## 手順

作業は `modules/m7-local-env/app` の中で行います。

### 0. 記録の Issue を作り、予想を書く

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M7-1`）を作ります。次の2つの予想を、**実行する前に**、「予想」の欄に書いてください。

- 匿名の鍵（anon）で、メモを追加しようとすると、どうなるか。
- サーバー用の鍵（service_role）で追加すると、どうなるか。

### 1. 中を見る

1. Studio（`http://127.0.0.1:55323`）の **Table Editor** を開き、左の一覧から `notes` を選ぶ。
2. 表の見出しで、列の名前と型（`id uuid`、`title text`、`body text`、`created_at timestamptz`）を確認する。行が 5 件あることを、画面下の「5 records」で確認する。
3. `supabase/migrations/20261029000000_create_notes.sql` を開き、手順 2 の列との対応を確かめる。
4. `supabase/seed.sql` を開き、5 件の行との対応を確かめる。
5. 表の上部の **RLS policy** ボタン（数字は、ポリシーの個数）を押す。Policies の画面に、`notes are readable by everyone`（COMMAND は `SELECT`）が出ていることを確認する。

### 2. 匿名の鍵で追加する

```bash
npm run insert -- "匿名で追加"
```

結果と、表示されたエラーメッセージを、記録の Issue のコメントに書き留めます。

### 3. サーバー用の鍵で追加する

```bash
npm run insert -- --admin "管理者の鍵で追加"
npm run notes
```

結果を確認します。件数は何件になりましたか（コメントに書く）。

### 4. 考える

- 匿名の鍵で追加が失敗したのは、`20261029000000_create_notes.sql` のどの部分が原因か。該当する行を指し示してください。（ヒント: 手順 1-5 で見たポリシーの `COMMAND`）
- サーバー用の鍵は、同じ操作が成功した。もしこの鍵が**ブラウザで動くコード**に入っていたら、何が起こりうるか。

### 5. 片づけ

```bash
npm run db:reset
npm run notes
```

**片づけの確認**: 「メモは 5 件です。」と表示され、追加したメモが消えていること。

## 振り返り

- anon と service_role の違いを、「できること」と「置いてよい場所」で説明できるか。
- ローカル環境の鍵が「秘密ではない」のに、扱いに気をつける理由は何か。

答えは [answers/1-explore-and-keys.md](../answers/1-explore-and-keys.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
