# 演習 M7-3: マイグレーションを足す

所要時間の目安: 15 分 / 前提: [演習 2](2-reset-and-seed.md)（片づけまで終えていること）

## 目的

データベースの形を変えるとき、**新しいマイグレーションのファイルを足す**流れを身につける。

## 手順

作業は `modules/m7-local-env/app` の中で行います。

### 0. 記録の Issue を作り、予想を書く

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M7-3`）を作ります。次の予想を、**実行する前に**書いてください。

- 新しいマイグレーションを適用すると、すでに入っている 5 件のメモは、どうなるか。
- 同じマイグレーションを、もう一度適用しようとすると、どうなるか。

### 1. 始める前の状態を確かめる

```bash
git status
ls supabase/migrations
```

`git status` に変更が出ないこと、`supabase/migrations` に `20261029000000_create_notes.sql` の 1 つだけがあることを確認します。**これが、片づけで戻す状態です。**（変更が出ている場合は、先に講師に相談してください。）

### 2. 新しいファイルを作る

```bash
npx supabase migration new add_priority
```

`supabase/migrations/` に、日時から始まる名前のファイルができます。ファイル名を確認してください。

### 3. 中身を書く

作られたファイルを開き、次の1行を書きます。

```sql
alter table public.notes add column priority integer not null default 0;
```

### 4. 適用する

```bash
npm run db:migrate
```

何が適用されたか、表示を確認します。

### 5. 確認する

1. Studio の **Table Editor** で `notes` を開き、`priority` 列が増えたことを確認する（Studio を開いたままの場合は、画面を再読み込みする）。
2. 既存の 5 件のメモは、残っているか。`priority` の値は何か。
3. Studio の **Database → Migrations**（`http://127.0.0.1:55323/project/default/database/migrations`）を開き、適用済みのマイグレーションの一覧に、自分が作ったものが増えていることを確認する。

### 6. もう一度、適用してみる

```bash
npm run db:migrate
```

何が起きましたか。

### 7. 片づけ

作った `*_add_priority.sql` を**削除**し、データベースを作り直します。

```bash
npm run db:reset
```

**片づけの確認**:

```bash
git status
ls supabase/migrations
```

手順 1 と同じ状態（`git status` に変更が出ない、マイグレーションが `20261029000000_create_notes.sql` の 1 つだけ）に戻っていること。Studio で `priority` 列が無いことも確認します。戻っていないまま次の演習に進むと、答えとずれます。

## 振り返り

- 列を足すために、`create_notes.sql` を書き換えずに、新しいファイルにしたのはなぜか。
- マイグレーションを「履歴」と呼ぶのは、なぜか。

答えは [answers/3-add-migration.md](../answers/3-add-migration.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
