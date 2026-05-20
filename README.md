
# Book Trip

React と Hono で作成した本のレビュー投稿サイトです。
自身が好きな本を説明文付きで投稿することができ、他のユーザーが投稿した本のレビューを閲覧することができます。
コンセプトは「お気に入りの本を共有して他のユーザーの視座を取り入れる旅に出る」です。

## 📖 開発の背景とコンセプト

Reactを個人で学習する中で、実際にAPIを作成し、フロントエンドからデータを取得する流れを理解したいと考え、バックエンドフレームワークであるHonoを用いて、本のレビューを投稿・閲覧できるWebアプリ「Book Trip」を開発しました。
コンセプトは「ユーザー同士のお気に入りの本を共有しあい、互いの視座を手に入れる旅に出る」です。

## デモ

**URL**: [https://booktrip.onrender.com](https://booktrip.onrender.com)

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
- Biome（コード解析ツール）
- 本番環境は Render へデプロイ

---

## ローカル環境での起動方法



### 1) リポジトリのクローン

```bash
git clone <リポジトリURL>
cd BookTrip
```

### 2) 環境変数を用意

ルートディレクトリに `.env` ファイルを作成し、必要な環境変数を設定します。
.env の中に以下を記述します。

```env
DATABASE_URL=postgresql://myapp:myapp_password@localhost:5433/myapp
```

### 3) 依存関係のインストール

```bash
pnpm install
```

### 4) Docker を起動

```bash
docker compose up -d
```

### 5) データベースのセットアップ

#### マイグレーションの実行

```bash
pnpm --filter @myapp/db migrate:deploy
```

#### テストデータのセット

```bash
pnpm --filter @myapp/db seed
```

### 6) アプリケーションの起動

```bash
pnpm dev
```