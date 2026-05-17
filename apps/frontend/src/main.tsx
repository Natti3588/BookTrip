import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import App from "./App.tsx"

// QueryClient のデフォルト設定
// - staleTime: キャッシュが「新鮮」と見なされる時間。短いとリクエスト増、長いと古い表示の可能性
// - retry: 失敗時の再試行回数。1 にしておくと一時的なネットワーク不調をリカバーしつつ無限ループは避けられる
// - refetchOnWindowFocus: window フォーカス時に自動再フェッチ。dev では off の方が直感的なので false
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("root element not found")

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
