import { zodResolver } from "@hookform/resolvers/zod"
import { updateNameSchema } from "@myapp/backend/src/schemas/auth"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { UpdateNameInput } from "../../lib/auth"

type Props = {
  currentName: string
  updateName: (data: UpdateNameInput) => Promise<void>
}

const NameSection = ({ currentName, updateName }: Props) => {
  const [success, setSuccess] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<UpdateNameInput>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: currentName },
  })

  const onSubmit = async (data: UpdateNameInput) => {
    setSuccess(null)
    setServerError(null)
    try {
      await updateName(data)
      reset({ name: data.name })
      setSuccess("ユーザー名を変更しました")
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "ユーザー名の変更に失敗しました")
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <label htmlFor="name">
        <h2 className="text-xl font-bold text-stone-800 mb-4">ユーザー名</h2>
      </label>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name")}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {success && <p className="text-sm text-green-700">{success}</p>}
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "保存中..." : "保存"}
        </button>
      </form>
    </section>
  )
}

export default NameSection
