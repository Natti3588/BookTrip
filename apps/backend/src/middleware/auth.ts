/**
 * 認証ミドルウェア（要ログインのルートに装着する）
 *
 * - 役割: Cookie取得 -> セッション検証 -> c.set("userId", session.userId)で後続のハンドラに伝搬
 * - 認証失敗時: 401を返して next を呼ばない（後続のハンドラには進まない）
 * - エラーメッセージは「Cookieなし」と「セッション無効」で区別しない
 */

import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { validateSession } from "../lib/auth.js"

// Hono の Context に「userId: string」を追加するための型
export type AuthVariables = {
  userId: string
}

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  // セッション Cookie を取得（未ログインなら undefined）
  const sessionId = getCookie(c, "session")
  if (!sessionId) return c.json({ error: "ログインが必要です" }, 401)

  // Dbでセッションを検証
  // - 期限切れだった場合、セッションを削除
  const session = await validateSession(sessionId)
  if (!session) return c.json({ error: "ログインが必要です" }, 401)

  // 後続ハンドラへ userId を渡す
  c.set("userId", session.userId)
  await next()
})
