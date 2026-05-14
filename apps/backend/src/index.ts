import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import authRoute from "./routes/auth.js"
import booksRoute from "./routes/books.js"

const app = new Hono()
  .route("/api/books", booksRoute)
  .route("/api/auth", authRoute)
  .use("/*", serveStatic({ root: "./public" }))
  .get("*", serveStatic({ path: "./public/index.html" }))
// 本番環境では指定されたポートを使い、開発環境では3000を使う
serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 })

export type AppType = typeof app
