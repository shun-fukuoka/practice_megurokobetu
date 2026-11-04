# 演習 M1-2: 記録する

所要時間の目安: 30 分 / 前提: [演習 1](1-read-the-state.md)（片づけの確認まで終えていること）

## 目的

ブランチを作り、変更を **add → commit → push** で、GitHub に送るまでの、一連の流れを体験する。

> コードは書きません。`practice/diary.md` に、短い 1 行を足すだけです。

## 手順

### 0. 記録の Issue を作り、予想を書く（自分の力で）

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M1-2`）を作ります。次の予想を、**実行する前に**書いてください。

- ブランチを作って、日記に 1 行足して、コミットしたあと、**`main` に切り替える**と、日記は、どうなるか。
- `push` する前と後で、**GitHub の画面**には、何が見えるか。
- `git add` の前と後で、`git status` の表示は、どう変わるか。

### 1. 始める前の状態

```bash
git status
```

きれいな状態（`working tree clean`）で、`main` にいることを確認します。

### 2. ブランチを作る

```bash
git switch -c practice/git-2
```

「`Switched to a new branch 'practice/git-2'`」と表示されることを確認します。

### 3. 日記を編集する

エディタで、`modules/m1-git-basics/practice/diary.md` の**いちばん下に、次の 1 行を足して**、保存します。

```text
- 2行目: ブランチで記録した
```

```bash
git status
```

`Changes not staged for commit`（**変更したが、まだ add していない**）と表示されることを確認します（`modified:` の後ろに、ファイル名が出ます）。

### 4. add する

```bash
git add modules/m1-git-basics/practice/diary.md
git status
```

表示は、どう変わりましたか（`Changes to be committed` に変わります。**記録待ち**の状態です）。

### 5. commit する

```bash
git commit -m "practice: 日記に1行足す"
git log --oneline
```

履歴の先頭に、**自分のコミット**が増えたことを確認します。記録に、`log` の表示を、書き写します。

### 6. push する

```bash
git push -u origin practice/git-2
```

`practice/git-2 -> practice/git-2` のような表示が出れば、成功です。

### 7. GitHub の画面で見る

GitHub で、自分のリポジトリを開きます。

1. 左上の、ブランチを切り替える欄（通常は `main`）を押し、**`practice/git-2`** を選ぶ。
2. `modules/m1-git-basics/practice/diary.md` を開き、**足した 1 行**があることを確認する。
3. もう一度、ブランチを `main` に切り替え、同じファイルを開く。**足した 1 行は、あるか。**

### 8. main に戻る

```bash
git switch main
git status
```

エディタで `diary.md` を開き直して、**足した 1 行が、消えている**ことを確認します（ブランチごとに、ファイルの中身が、切り替わります）。

### 9. 考える

- なぜ、`main` ではなく、**ブランチ**で作業するのか。
- `add` と `commit` を、分けている利点は何か。
- `push` するまで、他の人には、何が見えないか。

### 10. 片づけの確認

```bash
git status
git branch
```

`main` にいて、`working tree clean` であること。**ブランチ `practice/git-2` は、残して構いません**（ブランチの削除は、PR を学んだあと（[M4](../../m4-pr-and-ci/README.md)）に、練習します）。

## 振り返り

- コミットした変更は、**どこに**記録されているか（自分のパソコンか、GitHub か）。push の前と後で、どう違うか。
- `git switch main` で、日記の中身が変わったのは、なぜか。

答えは [answers/2-record-a-change.md](../answers/2-record-a-change.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
