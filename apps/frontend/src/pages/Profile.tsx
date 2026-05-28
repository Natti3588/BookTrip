import { useNavigate } from "react-router"
import DeleteAccountSection from "../components/profile/DeleteAccountSection"
import NameSection from "../components/profile/NameSection"
import PasswordSection from "../components/profile/PasswordSection"
import { useAuth } from "../contexts/AuthContext"

// プロフィール画面
// 3つのセクション（名前変更 / パスワード変更 / アカウント削除）をまとめて表示する
// 各セクションの実装詳細は components/profile/ 配下を参照
const Profile = () => {
  const { currentUser, updateName, deleteAccount } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif font-bold text-3xl text-stone-800 mb-8">プロフィール</h1>

      {/* ユーザー名変更 */}
      <NameSection currentName={currentUser?.name ?? ""} updateName={updateName} />

      {/* パスワード変更 */}
      <PasswordSection />

      {/* アカウント削除 */}
      <DeleteAccountSection
        deleteAccount={deleteAccount}
        onDeleted={() => navigate("/", { replace: true })}
      />
    </div>
  )
}

export default Profile
