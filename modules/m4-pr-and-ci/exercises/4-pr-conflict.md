# 演習 M4-4: PR の競合を解消する

所要時間の目安: 35 分 / 前提: [README](../README.md) の 5 節、[M1 の演習 4](../../m1-git-basics/exercises/4-conflict.md)（手元でのコンフリクトの解消）

## 目的

**2 つの PR が同じ場所を変更し、片方が先にマージされると、もう片方が競合する**様子を観察し、PR の作者として**解消して、PR を更新する**。

> コードは書きません。`practice/notes.md`（短いメモ）の 1 行を、2 つの PR で別々に書き換えます。1 人で行えます。

## 手順

### 0. 記録の Issue を作り、予想を書く（自分の力で）

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M4-4`）を作ります。次の予想を、**実行する前に**書いてください。

1. 2 つの PR を出した直後、どちらかに「競合」と表示されるか。
2. PR A をマージしたあと、PR B の表示は、どうなるか。
3. 競合を解消して push すると、PR B の CI は、動くか。

### 1. PR A を出す

```bash
git switch main
git pull
git switch -c practice/pr-a
```

`modules/m4-pr-and-ci/practice/notes.md` の「`- 担当: 未定`」を、「`- 担当: 田中`」に書き換えて保存します。

```bash
git add modules/m4-pr-and-ci/practice/notes.md
git commit -m "practice: 担当を田中にする"
git push -u origin practice/pr-a
```

GitHub で、`main` 宛ての PR（PR A）を出します。**マージは、まだしません。**

### 2. PR B を出す

**`main` に戻ってから**、別のブランチを作ります（PR A の変更は、入っていません）。

```bash
git switch main
git switch -c practice/pr-b
```

同じ行を、「`- 担当: 鈴木`」に書き換えて保存します。

```bash
git add modules/m4-pr-and-ci/practice/notes.md
git commit -m "practice: 担当を鈴木にする"
git push -u origin practice/pr-b
```

GitHub で、`main` 宛ての PR（PR B）を出します。**この時点で、PR B に「競合」の表示が出ているか**を、確認します。

### 3. PR A をマージして、PR B を見る

PR A を**マージ**します。そのあと、PR B の画面を**再読み込み**して、表示の変化を、記録の Issue に書きます。（表記は変わることがあります。「競合がある」という趣旨の表示と、マージのボタンの状態を見ます。）

### 4. 手元で、解消する

```bash
git switch practice/pr-b
git fetch origin
git merge origin/main
```

`CONFLICT (content): Merge conflict in ...notes.md` と出ます。ファイルを開くと、次のようになっています（M1-4 と同じ読み方です。**今回の `HEAD` は PR B 側、`origin/main` は PR A がマージされた `main` 側**です）。

```text
<<<<<<< HEAD
- 担当: 鈴木
=======
- 担当: 田中
>>>>>>> origin/main
```

**両方の内容を理解して**、次の 1 行にします（印は、すべて消す）。

```text
- 担当: 田中、鈴木
```

> 実際の開発では、どちらを残すかは、**相手に聞いて決めます**。今回は、両方を残します。

### 5. 解消を記録して、PR を更新する

```bash
git diff --check
git add modules/m4-pr-and-ci/practice/notes.md
git commit --no-edit
cd modules/m4-pr-and-ci/app
npm run check
cd ../../..
git push
```

- `git diff --check` が、何も表示しないこと。
- `npm run check` が、緑であること（**解消のあとも、テストを通す**）。

PR B の画面で、**競合の表示が消え**、**CI がもう一度動く**ことを確認します。

### 6. PR B をマージして、片づける

PR B をマージします。

```bash
git switch main
git pull
git status
```

`main` にいて、`working tree clean` であること。`practice/notes.md` の担当が、「田中、鈴木」になっていること。

### 7. 考える

- PR B の作者が、解消する理由は何か。（PR A の作者に頼まない理由）
- 解消のあとに、`npm run check` と CI を、もう一度通すのは、なぜか。
- 相手の変更（「田中」）を、**黙って消して**「鈴木」だけにしたら、何が起きるか。
- AI に解消を頼むなら、何を確かめるか。

## 振り返り

- PR が競合する**仕組み**を、自分の言葉で説明できるか。
- 競合したとき、**最初にすること**は何か。

答えは [answers/4-pr-conflict.md](../answers/4-pr-conflict.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
