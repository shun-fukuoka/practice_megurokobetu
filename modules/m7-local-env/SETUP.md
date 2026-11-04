# ローカルの Supabase を用意する（導入ガイド）

所要時間の目安: 初回 30〜60 分（イメージの取得に時間がかかります）

**自分のパソコンの中だけで動く、自分専用の Supabase** を用意します。Supabase のウェブサイトでのアカウント登録や、クラウド上のプロジェクトは**不要**です。接続用の URL と鍵（キー）は、起動したときに自分のパソコンが教えてくれるので、それを自分で取得して使います。

## 手順 0: 準備するもの

| 必要なもの | 確認の方法 | 備考 |
|---|---|---|
| Docker Desktop | 起動して、画面に「Engine running」と出ている | データベースなどを「コンテナ」という箱の中で動かすために使う。Windows では WSL 2 を使う設定が一般的 |
| Node.js 22 以上 | `node --version` | |
| Git | `git --version` | |
| 空き容量と、メモリ | 目安: 空き容量 10GB 以上、メモリ 8GB 以上 | 初回に数 GB のイメージを取得する |

> Docker Desktop は、**必ず起動した状態**で次に進んでください。起動していないと、手順 2 でエラーになります。

## 手順 1: アプリの準備

自分のリポジトリで、次を実行します。

```bash
cd modules/m7-local-env/app
npm ci
```

## 手順 2: ローカルの Supabase を起動する

```bash
npm run db:start
```

- 初回は、イメージの取得で数分〜数十分かかります。途中で止まったように見えても、待ってください。
- 成功すると、URL や鍵などの一覧が表示されます。
- 起動時に、`supabase/migrations/` のマイグレーションと、`supabase/seed.sql` の架空のデータが、自動で適用されます。

## 手順 3: 管理画面（Studio）を開く

ブラウザで次を開きます。

```
http://127.0.0.1:55323
```

左のメニューの「Table Editor」で、`notes` テーブルに 5 件のメモが入っていることを確認します。

### Studio の使い方（画面は英語表記です）

演習で使う操作は、次のとおりです。

| やりたいこと | 操作 |
|---|---|
| テーブルの中身を見る | 左端のアイコンの列から **Table Editor**（表のアイコン）→ 左の一覧の `notes`。列の名前と型は、表の見出しに出る。件数は、画面下の「N records」 |
| 行を**すべて削除**する | 表の見出しの、いちばん左の**チェックボックス**を押す → 右上の赤い「**Delete N rows**」→ 確認の表示の「**Delete**」。成功すると「This table is empty」 |
| RLS のルール（ポリシー）を見る | 表の上部の「**RLS policy**」ボタン（数字は個数）。または `http://127.0.0.1:55323/project/default/database/policies` |
| 適用済みのマイグレーションを見る | `http://127.0.0.1:55323/project/default/database/migrations`（左メニューの Database → Migrations）。「VERSION」「NAME」の一覧と、「View migration SQL」 |

- ターミナルで変更したあと、Studio の表示が古いままのことがあります。**画面を再読み込み**してから見てください。
- 上の画面の説明は、動作確認をした時点の Studio（CLI 版 2.122）のものです。バージョンによって、ボタンの位置や表記が少し変わる場合があります。

## 手順 4: 接続用の URL と鍵を取得して、`.env` を作る

### 4-1. 値を確認する

```bash
npx supabase status -o env
```

次のような一覧が出ます（値は、あなたのパソコン固有のものです）。

| 名前 | 意味 | このコースで使うか |
|---|---|---|
| `API_URL` | ローカルの API の入口 | 使う → `SUPABASE_URL` |
| `ANON_KEY` | 匿名の（誰でも使える）公開用の鍵。RLS のルールに従う | 使う → `SUPABASE_ANON_KEY` |
| `SERVICE_ROLE_KEY` | サーバー専用の強い鍵。RLS を迂回する | 使う → `SUPABASE_SERVICE_ROLE_KEY` |
| `DB_URL` | データベースへの直接の接続先 | 今は使わない |
| `PUBLISHABLE_KEY` / `SECRET_KEY` | 新しい形式の鍵（`ANON_KEY` / `SERVICE_ROLE_KEY` と対応） | 今は使わない |
| `JWT_SECRET` | 鍵の署名に使う秘密 | **使わない・どこにも書かない** |

### 4-2. `.env` を作る

`.env.example` をコピーして `.env` という名前のファイルを作り、上の3つの値を書き写します。

```bash
# Mac / Linux / Git Bash
cp .env.example .env
```

```powershell
# Windows の PowerShell
Copy-Item .env.example .env
```

```bat
:: Windows のコマンドプロンプト
copy .env.example .env
```

> このコースのコマンドは、**Git Bash**（Windows）または Mac / Linux の端末で動作を確認しています。Windows の PowerShell・コマンドプロンプトでの実行は、確認していません。迷ったら、Git Bash を使ってください（Git for Windows に付属しています）。

### 4-3. 確認する

```bash
git status
```

**`.env` が一覧に出ない**ことを確認してください（`.gitignore` により、Git に入らない設定になっています）。もし出てしまったら、コミットせず、講師に伝えてください。

### 鍵について知っておくこと

- ここで使う鍵は、**自分のパソコンの中だけのローカル環境の値**です。既定の設定では、誰のパソコンでも同じ、デモ用の値になります。そのため、これ自体は「秘密」ではありません。
- ただし、**本物のプロジェクト（本番・staging）の鍵は別物で、絶対にここに書きません。** コードにも、`.env` にも、チャットにも、AI にも貼りません。実際の開発では、本物の鍵は開発者に渡さず、自動化の仕組み（CI）と管理者だけが持ちます。
- 習慣として、**`.env` は Git に入れない**、**鍵はコードに直接書かない**を守ってください。

## 手順 5: 動作を確認する

```bash
npm run notes
```

次のように表示されれば成功です。

```
メモは 5 件です。
- はじめてのメモ
...
```

## 後片づけと再開

| やりたいこと | コマンド |
|---|---|
| 止める（パソコンの負荷を下げたいとき） | `npm run db:stop` |
| もう一度起動する | `npm run db:start` |
| 初期状態に戻す（マイグレーションと架空のデータを、一から入れ直す） | `npm run db:reset` |

## うまくいかないとき

| 症状 | 原因と対処 |
|---|---|
| `Cannot connect to the Docker daemon` などのエラー | Docker Desktop が起動していない。起動して「Engine running」になってから、もう一度 |
| ポートが使用中というエラー | このコースの設定は、他のプロジェクトのローカル環境と衝突しないよう、既定とは別のポート（55321〜55324 など）にしてある。それでも使用中なら、`supabase/config.toml` のポート番号を変える。変えたら、`.env` の `SUPABASE_URL` も合わせる |
| `npm run notes` で「`.env` が見つからない」 | 手順 4-2 を行っていない。`app` フォルダの中で `.env` を作る |
| `npm run notes` で「設定されていません」 | `.env` の値が空。手順 4-1 の出力から書き写す |
| `npm run notes` で取得に失敗する | ローカルの Supabase が起動していない。`npm run db:start` を実行 |
| 初回の起動が、いつまでも終わらない | イメージの取得中の可能性が高い。ネットワークの状態を確認して待つ。それでも進まなければ、講師に伝える |
| Windows の PowerShell で、`npm` が「このシステムではスクリプトの実行が無効」というエラーになる | PowerShell の実行ポリシーの制限（よくある事象）。**Git Bash** か**コマンドプロンプト**で実行するか、講師に相談して、自分のユーザーだけ `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` で緩める。※この事象は、この教材では再現確認していません |
| Windows の PowerShell で、日本語の引数（`npm run insert -- "..."`）が文字化けする | 文字化けする場合は、Git Bash で実行するか、英数字のタイトルにする。※PowerShell での実行は、この教材では動作確認していません |

## 次へ

[M7 README](README.md) に戻って、演習に進みます。
