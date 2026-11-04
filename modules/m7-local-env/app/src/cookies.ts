/**
 * Cookie の読み取りと、Set-Cookie ヘッダーの組み立て（M9）。
 * 外部に依存しない純粋関数なので、単体テストで確かめられる。
 */

export type CookieOptions = {
  /** JavaScript から読めなくする（XSS で、Cookie を盗まれにくくする） */
  httpOnly?: boolean;
  /** 他のサイトからのリクエストに、Cookie を付けない範囲（CSRF 対策） */
  sameSite?: "Lax" | "Strict" | "None";
  /** HTTPS の通信でだけ送る（ローカルの http では付けない） */
  secure?: boolean;
  path?: string;
  /** 有効期間（秒）。0 を指定すると、Cookie を消す */
  maxAgeSeconds?: number;
};

/** リクエストの `Cookie` ヘッダーを、名前と値の対応にする。 */
export function parseCookies(header: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const name = part.slice(0, index).trim();
    const raw = part.slice(index + 1).trim();
    if (!name) continue;
    try {
      result[name] = decodeURIComponent(raw);
    } catch {
      result[name] = raw;
    }
  }
  return result;
}

/** `Set-Cookie` ヘッダーの値を作る。 */
export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAgeSeconds !== undefined) parts.push(`Max-Age=${options.maxAgeSeconds}`);
  parts.push(`Path=${options.path ?? "/"}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");
  return parts.join("; ");
}
