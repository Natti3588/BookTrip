import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { validateSession } from "../lib/auth.js"

export type AuthVariables = {
    userId: string
}

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
    async (c, next) => {
        // CookieからセッションIDを取り出す
        const sessionId = getCookie(c, "session")
        // Cookieがない場合はundefinedが買えるので、401エラーを投げてreturn
        if (!sessionId) return c.json({ error: "Unauthorized" }, 401)

        // Dbでセッションを検証
        const session = await validateSession(sessionId)
        // セッションが無効な場合は、401エラーを投げてreturn
        if (!session) return c.json({ error: "Unauthorized" }, 401)

        // userIdをコンテキストに保存
        c.set("userId", session.userId)
        await next()
    }
)