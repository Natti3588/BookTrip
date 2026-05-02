import { z } from "zod"

export const createBookSchema = z.object({
    title: z.string().min(1, "タイトルは必須です").max(200),
    author: z.string().min(1, "著者は必須です").max(100),
    genre: z.string().min(1, "ジャンルは必須です"),
    publishedYear: z.number().int().min(1000).max(new Date().getFullYear() + 1),
    coverImage: z.url("URL形式で入力してください"),
    description: z.string().min(1, "説明は必須です").max(2000),
    rating: z.number().int().min(1).max(5).optional(),
})

export type CreateBookInput = z.infer<typeof createBookSchema>