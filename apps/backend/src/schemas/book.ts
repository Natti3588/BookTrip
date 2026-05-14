import { z } from "zod"

export const GENRES = [
  "小説",
  "ノンフィクション",
  "ビジネス",
  "自己啓発",
  "科学",
  "技術",
  "歴史",
  "ファンタジー",
  "ミステリー",
  "SF",
  "ロマンス",
  "詩",
  "エッセイ",
  "その他",
] as const

const bookFieldSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200),
  author: z.string().min(1, "著者は必須です").max(100),
  genre: z.enum(GENRES, { error: "有効なジャンルを選択してください" }),
  publishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1),
  coverImage: z.url("URL形式で入力してください"),
  description: z.string().min(1, "説明は必須です").max(2000),
  rating: z.number().int().min(1).max(5).optional(),
})

export const createBookSchema = bookFieldSchema

export const updateBookSchema = bookFieldSchema

export const bookIdParamSchema = z.object({
  id: z.cuid2("不正なIDです"),
})
