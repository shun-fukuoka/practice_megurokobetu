# 演習 M1-4: コンフリクト（衝突）を起こして、解消する

所要時間の目安: 30 分 / 前提: [演習 3](3-undo.md)（`main` にいて、きれいな状態）

## 目的

- **同じ場所を、別々のブランチで変更すると、合わせるときに衝突する**ことを、自分の手で起こして確かめる。
- 衝突の**印（マーカー）の読み方**と、**解消の手順**、**やめる方法**を知る。

> コードは書きません。`practice/diary.md` の **1 行目**を、別々のブランチで書き換えるだけです。1 人で行えます（衝突は、2 人で起こすものと思いがちですが、**ブランチが 2 つあれば起きます**）。

## 手順

### 0. 記録の Issue を作り、予想を書く（自分の力で）

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M1-4`）を作ります。次の予想を、**実行する前に**書いてください。

1. 2 つのブランチが、`diary.md` の**同じ行**を、**別の内容**に書き換えて、それを合わせると、何が起きると思うか。
2. 2 つのブランチが、**別の行**を書き換えた場合は、どうなると思うか。
3. Git は、どちらの内容を残すと思うか。（理由も）

### 1. ブランチ A で、1 行目を書き換える

```bash
git switch main
git switch -c practice/conflict-a
```

エディタで `modules/m1-git-basics/practice/diary.md` を開き、1 行目の「はじめての記録」を、「**朝の記録**」に書き換えて保存します（`- 1行目: 朝の記録` になります）。

```bash
git add modules/m1-git-basics/practice/diary.md
git commit -m "practice: 朝の記録"
```

### 2. ブランチ B で、同じ行を、別の内容に書き換える

**`main` に戻ってから**、もう 1 つブランチを作ります（A の変更は、入っていません）。

```bash
git switch main
git switch -c practice/conflict-b
```

同じファイルの 1 行目を、今度は「**夜の記録**」に書き換えて保存します。

```bash
git add modules/m1-git-basics/practice/diary.md
git commit -m "practice: 夜の記録"
```

### 3. A を、B に合わせる（衝突する）

いま、`practice/conflict-b` にいます。ここへ A を、**合わせます（マージ）**。

```bash
git merge practice/conflict-a
```

`CONFLICT (content): Merge conflict in ...` と表示され、`Automatic merge failed` と出ます。**失敗ではなく、「自動では決められないので、人が決めて」という合図**です。

```bash
git status
```

「`You have unmerged paths`」と「`both modified: ...diary.md`」を確認します。

### 4. 印（マーカー）を読む

エディタで `diary.md` を開きます。次のような表示があります。

```text
<<<<<<< HEAD
- 1行目: 夜の記録
=======
- 1行目: 朝の記録
>>>>>>> practice/conflict-a
```

| 印 | 意味 |
|---|---|
| `<<<<<<< HEAD` から `=======` まで | **今いるブランチ（B）**の内容 |
| `=======` から `>>>>>>> practice/conflict-a` まで | **合わせようとしている側（A）**の内容 |

記録の Issue に、**どちらがどちらか、自分の言葉で**書いておきます。

### 5. 解消する

**印の行（`<<<<<<<`、`=======`、`>>>>>>>`）を、すべて消し**、残したい内容だけにします。今回は、**両方を残して**、次のようにします。

```text
- 1行目: 朝の記録
- 2行目: 夜の記録
```

> どちらを残すかは、**人が、内容を理解して決める**ことです。迷ったら、書いた人に聞きます。

保存したら、**印が残っていないこと**を確かめます。

```bash
git diff --check
```

何も表示されなければ、印は残っていません（`leftover conflict marker` と出たら、まだ残っています）。

### 6. 解消を記録する

```bash
git add modules/m1-git-basics/practice/diary.md
git status
git commit --no-edit
git log --oneline --graph
```

- `git status` が「`All conflicts fixed but you are still merging`」になること。
- `git log --oneline --graph` に、**2 本の流れが合流する形**（マージのコミット）が表示されること。

### 7. 【任意】やめる方法も試す

衝突の途中で「やっぱりやめる」には、`git merge --abort` を使います（合わせる前の状態に戻ります。`reset --hard` のような危険なコマンドは、要りません）。もう一度、衝突を起こして試します。

1. `git switch main` → `git switch -c practice/conflict-c`。
2. 1 行目を「**昼の記録**」に書き換えて、add・commit。
3. `git merge practice/conflict-a` で衝突させる。
4. **解消せずに**、`git merge --abort` を実行する。
5. `git status` が、きれいな状態に戻ったことを確認する。

### 8. 考える

- 印を消し忘れて、そのままコミットしたら、どうなるか。（`diary.md` の中身を想像する）
- Git が**自動で合わせられた**のは、どんなときか。（予想の 2 を、実際に試してもよい: 別の行を書き換えた 2 つのブランチを、合わせる）
- AI に頼んで解消してもらうとき、**何を確かめる**べきか。

### 9. 片づけの確認

```bash
git switch main
git status
```

`main` にいて、`working tree clean` であること。（練習のブランチは、残して構いません。push はしていません。）

## 振り返り

- 衝突は、**なぜ**起きるのか。Git が自分で決めない理由は何か。
- 衝突したとき、**最初に確かめること**は何か。

答えは [answers/4-conflict.md](../answers/4-conflict.md)。見たあと、記録の Issue に「答えを見て気づいたこと」をコメントし、Issue を閉じます。
