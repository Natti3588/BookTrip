import type { AppType } from "backend/src/index"
import { hc } from "hono/client"

// Hono(backend)へCookieを送信するために、credentialsを設定
export const client = hc<AppType>("/", {
  init: {
    credentials: "include",
  },
})
