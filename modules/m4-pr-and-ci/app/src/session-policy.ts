/**
 * ミニアプリ: ログインセッションの有効期限の判定。
 *
 * 外部（Cookie・DB・時計）に依存しない「純粋関数」にしてある。
 * 現在時刻 `now` を引数で受け取るので、テストで時間を自由に動かせる。
 */

export type Session = {
  /** ログインした時刻（ミリ秒） */
  loginAt: number;
  /** 最後に操作した時刻（ミリ秒） */
  lastActiveAt: number;
};

export type Policy = {
  /** 操作がないまま経過してよい最大時間（ミリ秒） */
  idleMs: number;
  /** ログインからの最大時間（ミリ秒）。操作を続けていても、これを超えたら終了 */
  absoluteMs: number;
};

export type SessionStatus =
  | { valid: true }
  | { valid: false; reason: "missing" | "idle" | "absolute" };

/**
 * セッションが有効かを判定する。
 *
 * 設計の方針: 「判断できないときは閉じる側に倒す」。
 * セッション情報が無い（null）場合は、有効扱いにせず無効にする。
 */
export function evaluateSession(
  session: Session | null,
  now: number,
  policy: Policy,
): SessionStatus {
  if (session === null) {
    return { valid: false, reason: "missing" };
  }
  if (now - session.loginAt > policy.absoluteMs) {
    return { valid: false, reason: "absolute" };
  }
  if (now - session.lastActiveAt > policy.idleMs) {
    return { valid: false, reason: "idle" };
  }
  return { valid: true };
}
