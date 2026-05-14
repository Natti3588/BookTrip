// レスポンスから日本語エラーメッセージを取り出す共通ヘルパー
// - body.errorがstringならそれを返す(バックエンドのメッセージ)
// - JSONではない / errorキーがない / 文字列でない場合はfallbackを返す
export const extractError = async (res: Response, fallback: string): Promise<string> => {
  // レスポンスをJSONにパース 失敗したら空のオブジェクトを取得
  const body = await res.json().catch(() => ({}))
  // bodyにerrorキーが存在しているかつ、errorバリューが文字列ならば、body.errorを返す（そうでない場合はfallbackを返す）
  return "error" in body && typeof body.error === "string" ? body.error : fallback
}
