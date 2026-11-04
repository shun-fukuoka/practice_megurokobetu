# 演習 M1-3: 戻す

所要時間の目安: 25 分 / 前提: [演習 2](2-record-a-change.md)（ブランチ `practice/git-2` があること）

## 目的

- 間違えたとき、**安全に戻す**方法を試す。
- **危険なコマンド**が、何を失わせるかを、考える（実行はしません）。

> コードは書きません。`practice/diary.md` に、短い 1 行を足して、戻すだけです。

## 手順

### 0. 記録の Issue を作り、予想を書く（自分の力で）

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M1-3`）を作ります。次の予想を、**実行する前に**書いてください。

- **コミットしてしまった**間違いを、**履歴を消さずに**取り消すと、`git log --oneline` は、どうなるか。
- 次の 4 つのコマンドは、それぞれ、**何を失わせる**か。（予想で、かまいません）
  1. `git reset --hard`
  2. `git push --force`
  3. `git clean -f`
  4. `git branch -D practice/git-2`

### 1. 練習用のブランチに移る

```bash
git switch practice/git-2
git status
```

きれいな状態であることを確認します。

### 2. A: 未コミットの間違いを、捨てる

1. エディタで、`diary.md` の**いちばん下に、次の 1 行を足して**、保存します。

   ```text
   - 3行目: 間違った記録
   ```

2. 状態を確認して、捨てます。

   ```bash
   git status
   git restore modules/m1-git-basics/practice/diary.md
   git status
   ```

   間違いの 1 行が、消えたことを確認します。**これは取り消せません**（コミットしていないので、履歴にも残りません）。

### 3. B: コミットしてしまった間違いを、安全に取り消す

1. もう一度、`diary.md` に、同じ 1 行（`- 3行目: 間違った記録`）を足して、保存します。
2. **わざと、コミットします**。

   ```bash
   git add modules/m1-git-basics/practice/diary.md
   git commit -m "practice: 間違った記録"
   git log --oneline
   ```

3. **「打ち消す」コミットを作ります**（エディタは、開きません）。

   ```bash
   git revert HEAD --no-edit
   git log --oneline
   ```

   履歴に、何が増えましたか。`diary.md` の、間違いの 1 行は、どうなりましたか。**元のコミットは、履歴に残っていますか。**

### 4. C: 危険なコマンドの意味を考える（実行しません）

[README の 6 節](../README.md)の表を見ながら、次の 4 つが、**何を失わせるか**を、記録の Issue のコメントに、自分の言葉で書きます。

| コマンド | 何を失わせるか（自分の言葉で） |
|---|---|
| `git reset --hard` | |
| `git push --force` | |
| `git clean -f` | |
| `git branch -D practice/git-2` | |

**実行は、しません。**

### 5. 考える

- A（`restore`）と B（`revert`）で、**履歴に残るもの**は、どう違ったか。
- 危険なコマンドを、**AI が提案してきた**ら、どうするか。

### 6. 片づけの確認

```bash
git switch main
git status
```

`main` にいて、`working tree clean` であること。（練習のブランチは、残して構いません。`revert` のコミットは、自分のパソコンにあるだけです。push しなくても構いません。）

## 振り返り

- 「消す」と「打ち消す」の違いは、何か。なぜ、`revert` のほうが安全なのか。
- 戻したいとき、最初に確かめることは何か。

答えは [answers/3-undo.md](../answers/3-undo.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
