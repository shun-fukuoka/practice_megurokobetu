/**
 * ログイン版のメモ画面の HTML（M9）。外部に依存しない純粋関数。
 * 画面に出す文字は、すべて escapeHtml を通す（XSS 対策）。
 */

import { escapeHtml, type Note } from "./notes.js";

export type ViewUser = { email: string; role: string };

const HEAD = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">`;

function alertHtml(error?: string): string {
  return error ? `    <p role="alert">${escapeHtml(error)}</p>\n` : "";
}

export function renderSecurePage(options: { notes: Note[]; user: ViewUser | null; error?: string }): string {
  const { notes, user, error } = options;
  const items = notes.map((n) => `      <li>${escapeHtml(n.title)}</li>`).join("\n");

  let account: string;
  let addForm: string;
  if (user) {
    account = `    <p id="account">ログイン中: ${escapeHtml(user.email)}（役割: ${escapeHtml(user.role)}）</p>
    <form method="post" action="/logout"><button type="submit">ログアウト</button></form>
`;
    addForm =
      user.role === "teacher"
        ? `    <form method="post" action="/notes">
      <label for="title">タイトル</label>
      <input id="title" name="title" type="text">
      <button type="submit">追加</button>
    </form>
`
        : `    <p>メモを追加できるのは、講師（teacher）だけです。</p>
`;
  } else {
    account = `    <p id="account">ログインしていません。<a href="/login">ログイン</a></p>
`;
    addForm = `    <p>メモを追加するには、ログインが必要です。</p>
`;
  }

  return `${HEAD}
    <title>メモ（ログイン版）</title>
  </head>
  <body>
    <h1>メモ（ログイン版）</h1>
${account}${alertHtml(error)}    <ul aria-label="メモの一覧">
${items}
    </ul>
${addForm}  </body>
</html>
`;
}

export function renderLoginPage(error?: string): string {
  return `${HEAD}
    <title>ログイン</title>
  </head>
  <body>
    <h1>ログイン</h1>
${alertHtml(error)}    <form method="post" action="/login">
      <label for="email">メールアドレス</label>
      <input id="email" name="email" type="email">
      <label for="password">パスワード</label>
      <input id="password" name="password" type="password">
      <button type="submit">ログイン</button>
    </form>
    <p><a href="/">メモの一覧へ戻る</a></p>
  </body>
</html>
`;
}

export function renderMessagePage(title: string, message: string): string {
  return `${HEAD}
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p role="alert">${escapeHtml(message)}</p>
    <p><a href="/">メモの一覧へ戻る</a></p>
  </body>
</html>
`;
}

/**
 * 【危険・演習 M9-4 専用】タイトルを、エスケープせずに、そのまま HTML に埋め込む。
 * XSS（画面に、悪意のあるスクリプトを埋め込まれる攻撃）が、どう起きるかを見せるための、
 * わざと危険にした版。通常は無効で、`--unsafe-demo` を付けて起動したときだけ使われる。
 */
export function renderUnsafePage(notes: Note[]): string {
  const items = notes.map((n) => `      <li>${n.title}</li>`).join("\n");
  return `${HEAD}
    <title>危険な画面（演習専用）</title>
  </head>
  <body>
    <h1>危険な画面（演習専用）</h1>
    <p>メモのタイトルを、エスケープせずに、そのまま表示しています。</p>
    <ul aria-label="メモの一覧">
${items}
    </ul>
    <p><a href="/">安全な画面へ戻る</a></p>
  </body>
</html>
`;
}
