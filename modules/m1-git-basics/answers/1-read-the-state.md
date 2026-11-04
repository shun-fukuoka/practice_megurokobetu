# M1-1 の答えと解説

> 先に、自分の予想と観察を書き残してから読んでください。表示の文は、Git のバージョンや言語設定で、少し違うことがあります（日本語で表示される場合もあります）。この手順は、使い捨てのリポジトリで、実際に動作を確認しています。

## 手順 1: 今の状態

### 答え

- **今いるブランチ**: `On branch main`（`main` にいる）。
- **変更の有無**: `nothing to commit, working tree clean`（「記録していない変更は、ない」）。`Your branch is up to date with 'origin/main'` は、「GitHub の `main` と、同じ」という意味。
- **履歴**: `git log --oneline` に、コミットが 1 行ずつ表示される（数は、リポジトリによって違う）。左の短い文字列が、コミットの識別子、右が、メモ。
- **`git branch`**: `* main`（`*` が、今いるブランチ）。

## 手順 3: 変更を読む

### ヒント

- `status` は「どのファイルが、どういう状態か」。`diff` は「中身の、どこが、どう違うか」。

### 答え

`git status` は、次のように表示されます（抜粋）。

```
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   modules/m1-git-basics/practice/diary.md

no changes added to commit
```

- **`Changes not staged for commit`**: 「**変更したが、まだ記録の対象に選んでいない（add していない）**」という意味。
- **`modified:`**: そのファイルを、変更した。

`git diff` は、次のように表示されます（抜粋）。

```
@@ -1,3 +1,4 @@
 # 練習用の日記
 
 - 1行目: はじめての記録
+- 2行目: 今日は Git を試した
```

- **`+` で始まる行**は、**足した行**。（消した行は、`-` で始まる。）
- 行頭に何もない行は、変わっていない行（前後の文脈）。

## 手順 4: 変更を捨てる

### 答え

`git restore <ファイル>` を実行すると、**足した 1 行は消え**、`git status` が、きれいな状態に戻る。**その変更は、履歴にも残らず、取り消せません。**

## 振り返りの答え

- **`status` と `diff` の違い**: `status` は、**どのファイルが変わったか**（一覧）。`diff` は、**中身の、どこが、どう変わったか**（詳細）。まず `status` で全体を見て、気になるファイルを `diff` で詳しく見る。
- **`git restore` に注意が必要な理由**: コミットしていない変更は、**Git の履歴に残っていない**。`restore` で捨てると、**もう、取り戻せない**。捨ててよい変更かを、`git diff` で確かめてから実行する。
