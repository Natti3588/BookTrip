import { prisma } from "@myapp/db"
import bcrypt from "bcrypt"

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // ７日

export const hashPassword = (plain: string) => bcrypt.hash(plain, 10)

// タイミング攻撃（システムや暗号アルゴリズムの処理時間を推測してパスワードを盗む手法）
// の対策としてタイミング攻撃対策付きのcompare()メソッドを使う。
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash)

export const createSession = async (userId: string) => {
  return prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  })
}

export const validateSession = async (sessionId: string) => {
  // Sessionテーブルからデータを取得
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  })

  // データを取得できなかった場合はnullを返す
  if (!session) return null

  // セッション有効期限が過ぎていればば、Sessionテーブルからレコードを削除してnullを返す
  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({ where: { id: sessionId } })
    return null
  }
  // 成功したらsessionを返す
  return session
}

export const deleteSession = (sessionId: string) =>
  prisma.session.deleteMany({ where: { id: sessionId } })
