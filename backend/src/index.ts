import { serve } from "@hono/node-server"
import { Hono } from "hono"
import booksRoute from "./routes/books.js"

const app = new Hono()

app.route("/api/books", booksRoute)

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
