/**
 * 画面に出す文面を作る、外部に依存しない関数（単体テストしやすい）。
 *
 * 演習 M10-3 では、VERSION を書き換えて、「変更が公開されるまでの流れ」を体験する。
 */

export const VERSION = "v1";

/** 名前から、あいさつを作る。名前が空なら、名前なしのあいさつ。 */
export function buildGreeting(name: string): string {
  const trimmed = name.trim();
  return trimmed === "" ? "こんにちは、はじめまして！" : `こんにちは、${trimmed} さん！`;
}

/** HTML の特殊文字を、ただの文字に置き換える（XSS 対策。M9 で学んだこと）。 */
export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
