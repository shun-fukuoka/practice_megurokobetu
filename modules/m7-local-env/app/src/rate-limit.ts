/**
 * ログインの失敗を数えて、短い時間に何度も失敗したら、受け付けなくする（M9）。
 * パスワードを、機械的に何度も試す攻撃（ブルートフォース）への、基本的な対策。
 *
 * 現在時刻を引数で受け取れるので、単体テストで時間を動かせる。
 * 注意: 記録はメモリ上だけ。サーバーを再起動すると消え、複数台のサーバーでは共有されない。
 */

export type RateLimiter = {
  /** すでに、制限を超えているか */
  isBlocked(key: string): boolean;
  /** 失敗を 1 回記録する */
  recordFailure(key: string): void;
  /** 成功したので、記録を消す */
  reset(key: string): void;
  /** 制限が解けるまでの秒数（制限中でなければ 0） */
  retryAfterSeconds(key: string): number;
};

export function createRateLimiter(options: {
  maxFailures: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const now = options.now ?? Date.now;
  const failures = new Map<string, number[]>();

  function recent(key: string): number[] {
    const t = now();
    const list = (failures.get(key) ?? []).filter((time) => t - time < options.windowMs);
    if (list.length > 0) failures.set(key, list);
    else failures.delete(key);
    return list;
  }

  return {
    isBlocked(key) {
      return recent(key).length >= options.maxFailures;
    },
    recordFailure(key) {
      const list = recent(key);
      list.push(now());
      failures.set(key, list);
    },
    reset(key) {
      failures.delete(key);
    },
    retryAfterSeconds(key) {
      const list = recent(key);
      if (list.length < options.maxFailures) return 0;
      const oldest = list[0] ?? now();
      return Math.max(1, Math.ceil((oldest + options.windowMs - now()) / 1000));
    },
  };
}
