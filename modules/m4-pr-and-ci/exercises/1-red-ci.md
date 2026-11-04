# 演習 M4-1: CI を赤くして、直す

所要時間の目安: 25 分 / 前提: [README](../README.md)

## 目的

CI が赤くなる様子を観察し、**ログからエラーの原因を読み取って直す**流れを身につける。

## 手順

### 0. 記録の Issue を作る

[演習の進め方（M0 の 3b）](../../m0-orientation/README.md)に従い、「演習の記録」の Issue（演習: `M4-1`）を作ります。手順 3 の予想（いくつエラーが出るか／どの確認が出すか）は、**実行する前に**、この Issue に書いてください。

### 1. ブランチを作る

```bash
git switch main
git pull
git switch -c practice/red-ci
```

### 2. わざとエラーを入れる

`modules/m4-pr-and-ci/app/src/demo.ts` というファイルを新しく作り、次の内容を貼ります。

```ts
export function isZero(count: number): boolean {
  var label = "zero";
  return count == "0" && label.length > 0;
}
```

### 3. ローカルで確認する（その前に予想を書く）

先に、次を**予想して、記録の Issue に書いて**ください。

- いくつのエラーが出るか
- どの確認（lint / 型 / テスト）が、どのエラーを出すか

そのあと、実行します。

```bash
cd modules/m4-pr-and-ci/app
npm run check
```

### 4. push して、PR を出す

```bash
git add modules/m4-pr-and-ci/app/src/demo.ts
git commit -m "practice: CI を赤くする"
git push -u origin practice/red-ci
```

GitHub で、`main` 宛ての PR を出します（ドラフトで構いません）。PR テンプレートの項目を埋めてください。

### 5. CI のログを読む

PR の画面の「Checks」から、`verify` を開きます。

- 最初に失敗した**ステップ**はどれか。
- エラーメッセージのファイル名・行番号・ルール名を書き出す。
- 「なぜ、そのルールがあるのか」を、自分の言葉で説明する。

### 6. 直して、緑にする

`demo.ts` を修正し、`npm run check` が通ることを確認してから、再度 push します。CI が自動で再実行されることを確認します。

### 7. 片づけ

このブランチの PR は、**マージせずにクローズ**します。

## 振り返り

- 3つの確認（lint / 型 / テスト）のうち、最初に止まったのはどれか。それはなぜか。
- ローカルで `npm run check` を先に実行する利点は何か。
- もし CI がなかったら、このエラーはどこで見つかっていたと思うか。

答えは [answers/1-red-ci.md](../answers/1-red-ci.md)（先に自分の考えを書いてから）。
