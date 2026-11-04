# 演習 M5-1: Secrets と Variables

所要時間の目安: 30 分 / 前提: [README](../README.md)

## 重要

- 登録する値は、**すべてダミー**です。本物のパスワードやトークンは、絶対に登録しません。
- 使うワークフローは、`.github/workflows/m5-settings-demo.yml`（手動実行用）です。

## 手順

### 0. 先に予想を書く

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M5-1`）を作り、次の予想を、**実行前に**その Issue に書いてください。

- Variables に登録した値は、ワークフローのログにどう表示されるか。
- Secrets に登録した値を、`echo` で出力したら、ログにどう表示されるか。

### 1. Variables を登録する

自分のリポジトリで、Settings → Secrets and variables → Actions → **Variables** タブ → New repository variable。

- Name: `GREETING`
- Value: `hello`（何でもよい）

### 2. Secrets を登録する

同じ画面の **Secrets** タブ → New repository secret。

- Name: `DEMO_SECRET`
- Value: 適当な**ダミー文字列**（例: `dummy-value-for-practice`）

登録したあと、Secrets の値を**画面から見られるか**確かめてください。

### 3. ワークフローを実行する

Actions タブ → 「M5 settings demo」 → Run workflow。実行が終わったら、ログを開いて、2つのステップの出力を確認します。

### 4. 値を変えて、もう一度実行する

Variables の値を `hello` から別の値に変えて、再実行し、ログの出力が変わることを確認します。Secrets も、値を更新してみます（更新の画面では、現在の値は見えません）。

### 5. 考える

- ワークフローのファイル（`m5-settings-demo.yml`）を読んでください。値を、`run:` の中に直接 `${{ ... }}` で書かず、`env:` 経由で受け取っているのはなぜか。（ヒント: 値に、悪意のある文字列が入っていたら？）
- 実際の開発で、本番の秘密を**開発者に渡さず、CI だけが持つ**とすると、どんな利点があるか。

### 6. 片づけ

登録したダミーの Secrets と Variables を、削除します。

## 振り返り

- Variables と Secrets の違いを、一言で言うと。
- 「マスクされるから安全」と考えてよいか。

答えは [answers/1-secrets-and-variables.md](../answers/1-secrets-and-variables.md)（先に自分の考えを書いてから）。
