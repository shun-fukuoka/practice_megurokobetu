# 演習 M1-1: 読む

所要時間の目安: 20 分 / 前提: [README](../README.md) の準備（クローンして、`git status` が通ること）

## 目的

- `git status`・`git diff`・`git log --oneline`・`git branch` の**表示を読む**。
- 変更を**捨てる**（`git restore`）操作の重さを、体験する。

> コードは書きません。使うのは、`modules/m1-git-basics/practice/diary.md`（短い日記のファイル）だけです。

## 手順

作業は、クローンした自分のリポジトリのフォルダで行います。

### 0. 記録の Issue を作り、予想を書く（自分の力で）

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M1-1`）を作ります。次の予想を、**実行する前に**書いてください。

- `practice/diary.md` に 1 行足して保存したあと、`git status` には、何と表示されると思うか。
- `git diff` には、何が表示されると思うか。
- `git restore` を実行すると、足した 1 行は、どうなるか。

### 1. 今の状態を読む

```bash
git status
git log --oneline
git branch
```

次を、記録の Issue のコメントに書きます。

- 今いるブランチは何か。
- 変更はあるか（`status` のどの文から、そう言えるか）。
- 履歴（`log`）には、いくつのコミットがあるか。

### 2. ファイルを編集する

エディタで、`modules/m1-git-basics/practice/diary.md` を開き、**いちばん下に、次の 1 行を足して**、保存します。

```text
- 2行目: 今日は Git を試した
```

### 3. 変更を読む

```bash
git status
git diff
```

次を、記録に書きます。

- `status` には、何と表示されたか（**予想と、合っていましたか**）。`Changes not staged for commit` とは、どういう意味か。
- `diff` の、`+` で始まる行は、何を表しているか。

> Windows では、`warning: ... LF will be replaced by CRLF ...` と出ることがあります。**無害**です。

### 4. 変更を捨てる

```bash
git restore modules/m1-git-basics/practice/diary.md
git status
```

足した 1 行は、どうなりましたか。**この操作は、取り消せません**（その変更は、消えます）。履歴にも、残りません。

### 5. 片づけの確認

```bash
git status
```

「`nothing to commit, working tree clean`」と表示され、`diary.md` が、元の 3 行（見出し、空行、1 行目）に戻っていること。

## 振り返り

- `git status` と `git diff` の、役割の違いは何か。
- `git restore` は、なぜ「注意」が必要なのか。

答えは [answers/1-read-the-state.md](../answers/1-read-the-state.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
