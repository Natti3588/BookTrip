
# Book Trip

ReactとHonoで作成した本共有サイトです。
自身が好きな本を説明文付きで投稿でき、他のユーザーの好きな本を確認することができます。

---

## 機能

### 未ログインユーザー

- 本一覧を見れる
- 他のユーザーの好きな本を確認できる

###  ログインユーザー

- 本一覧を見れる
- 本を追加できる
- 自分が追加した本を編集・削除ができる
- 他のユーザーの好きな本を確認ができる

---

## 使用技術

### フロントエンド

- React + Vite（フレームワークとビルドツール）
- React Router（ルーティング）
- TailWind CSS（CSS ライブラリ）
- React Hook Form + Zod（フォームとバリデーション）
- TanStack Query（サーバーの状態管理）

### バックエンド

- Hono + Hono RPC Client（フレームワークと型推論）
- PostgreSQL + Prisma（データベースとORM）
- bcrypt + Cookie（セッションベース認証）

### インフラ・開発環境

- pnpm workspace + turbo でのモノレポ
- 本番環境は Render へデプロイ

