/**
 * メモ画面のロジック。外部（DB・ネットワーク）に依存しない「純粋関数」だけを置く。
 * 純粋関数は、単体テストで速く・確実に確かめられる（M8 演習 1）。
 */

export const TITLE_MAX = 100;

export type Note = {
  id: string;
  title: string;
  created_at: string;
};

export type TitleResult = { ok: true; title: string } | { ok: false; error: string };

/**
 * タイトルを検証する。前後の空白は取り除く。
 * データベース側の制約（1〜100 文字）と、同じルールにしてある。
 */
export function validateTitle(raw: string): TitleResult {
  const title = raw.trim();
  if (title.length === 0) {
    return { ok: false, error: "タイトルを入力してください。" };
  }
  if (title.length > TITLE_MAX) {
    return { ok: false, error: `タイトルは ${TITLE_MAX} 文字以内にしてください。` };
  }
  return { ok: true, title };
}

/** HTML の特殊文字を、画面にそのまま表示される文字に置き換える（XSS 対策の基本）。 */
export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** メモの一覧画面の HTML を作る。error があれば、フォームの上に表示する。 */
export function renderPage(notes: Note[], error?: string): string {
  const items = notes.map((n) => `      <li>${escapeHtml(n.title)}</li>`).join("\n");
  const errorHtml = error ? `    <p role="alert">${escapeHtml(error)}</p>\n` : "";

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>メモ</title>
  </head>
  <body>
    <h1>メモ</h1>
${errorHtml}    <ul aria-label="メモの一覧">
${items}
    </ul>
    <form method="post" action="/notes">
      <label for="title">タイトル</label>
      <input id="title" name="title" type="text">
      <button type="submit">追加</button>
    </form>
  </body>
</html>
`;
}
