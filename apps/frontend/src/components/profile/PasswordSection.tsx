import { zodResolver } from "@hookform/resolvers/zod"
import { updatePasswordSchema } from "@myapp/backend/src/schemas/auth"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { type UpdatePasswordInput, updatePassword } from "../../lib/auth"
import PasswordInput from "../PasswordInput"

const PasswordSection = () => {
  const [success, setSuccess] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const onSubmit = async (data: UpdatePasswordInput) => {
    setSuccess(null)
    setServerError(null)
    try {
      await updatePassword(data)
      reset()
      setSuccess("パスワードを変更しました")
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "パスワードの変更に失敗しました")
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-stone-800 mb-4">パスワード変更</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordInput
          id="current-password"
          label="現在のパスワード"
          autoComplete="current-password"
          disabled={isSubmitting}
          error={errors.currentPassword?.message}
          registration={register("currentPassword")}
        />

        <PasswordInput
          id="new-password"
          label="新しいパスワード（8文字以上）"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.newPassword?.message}
          registration={register("newPassword")}
        />

        <PasswordInput
          id="confirm-new-password"
          label="新しいパスワード（確認）"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.confirmNewPassword?.message}
          registration={register("confirmNewPassword")}
        />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {success && <p className="text-sm text-green-700">{success}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "変更中..." : "パスワードを変更"}
        </button>
      </form>
    </section>
  )
}

export default PasswordSection
