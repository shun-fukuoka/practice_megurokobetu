// 演習 M4-2 用: 秘密の検出を体験するための「偽のトークン」を、実行時に生成して書き出す。
//
// 値をリポジトリに置かないのは、置くと本物の検出器（gitleaks など）に常に拾われ、
// 通常のスキャンが赤くなってしまうため。実在するトークンではない（ランダムな文字列）。
//
// リポジトリのルートで実行すること:
//   node modules/m4-pr-and-ci/tools/make-fake-token.mjs

import { randomInt } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomString(length) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CHARS[randomInt(CHARS.length)];
  }
  return out;
}

const fakeToken = `ghp_${randomString(36)}`;

mkdirSync("notes", { recursive: true });
writeFileSync(
  "notes/leak-demo.txt",
  `# 演習用の偽の設定（実在しないトークン）\ngithub_token = "${fakeToken}"\n`,
);

console.log("notes/leak-demo.txt を作成しました（偽のトークンです）。");
