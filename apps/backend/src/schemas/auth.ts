import { z } from "zod"

export const signupSchema = z
  .object({
    email: z.email("メールアドレスの形式が正しくありません"),
    name: z.string().min(1, "名前を入力してください").max(50),
    password: z.string().min(8, "パスワードは8文字以上にしてください"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // ２つの入力値（password, confirmPassword）の整合性を確かめるクロスフィールドバリデーション
    error: "パスワードが一致しません",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.email("メールアドレスの形式が正しくありません"),
  // min(1)の理由は空欄のままサーバーに無駄な通信を発生させないため
  password: z.string().min(1, "パスワードを入力してください"),
})

// PATCH /api/auth/me のリクエストボディ Profile のユーザー名変更フォームから送信
export const updateNameSchema = z.object({
  name: z.string().min(1, "名前を入力してください").max(50),
})

// PUT /api/auth/me/password のリクエストボディ Profile のパスワード変更フォームから送信
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
    newPassword: z.string().min(8, "新しいパスワードは8文字以上にしてください"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: "新しいパスワードが一致しません",
    path: ["confirmNewPassword"],
  })

// DELETE /api/auth/me のリクエストボディ DeleteAccountDialog から送信
export const deleteAccountSchema = z.object({
  password: z.string().min(1, "パスワードを入力してください"),
})
