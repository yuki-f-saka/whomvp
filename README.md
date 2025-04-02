# whomvp

whomvpは、グループメンバーの順位付け投票を簡単に実施できるWebアプリケーションです。直感的なドラッグ&ドロップ操作で投票を行い、結果をリアルタイムで確認することができます。

## 技術スタック

- [Next.js](https://nextjs.org) 15.2.3
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com)
- [@dnd-kit](https://dndkit.com) (ドラッグ&ドロップ機能)

## 主な機能

- グループ作成：投票を行うグループを作成
- メンバー管理：グループにメンバーを追加・削除
- 順位付け投票：ドラッグ&ドロップで簡単に順位付け
- 投票結果表示：リアルタイムでの結果集計と表示
- 投票用URL共有：メンバーへの投票URLの共有機能

## 環境構築

### 必要な環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=あなたのSupabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase Anon Key
```

### インストールと実行

1. リポジトリのクローン
```bash
git clone <repository-url>
cd whomvp
```

2. 依存関係のインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```

4. ブラウザで開く
[http://localhost:3000](http://localhost:3000)

## データベース構造

### テーブル構成

#### groups (グループテーブル)
- id: UUID (PRIMARY KEY)
- name: TEXT
- created_at: TIMESTAMP

#### members (メンバーテーブル)
- id: UUID (PRIMARY KEY)
- group_id: UUID (FOREIGN KEY -> groups.id)
- name: TEXT
- created_at: TIMESTAMP

#### votes (投票テーブル)
- id: UUID (PRIMARY KEY)
- group_id: UUID (FOREIGN KEY -> groups.id)
- voter_id: UUID (FOREIGN KEY -> members.id)
- ranked_members: JSONB
- created_at: TIMESTAMP

### リレーション
- groups -> members: 1対多
- groups -> votes: 1対多
- members -> votes: 1対多

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にログイン
2. 「New Project」をクリック
3. リポジトリを選択
4. 環境変数を設定
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 「Deploy」をクリック

デプロイ後、自動的にプロジェクトのURLが生成されます。

### 環境変数の設定

Vercelダッシュボードで以下の手順で環境変数を設定できます：

1. プロジェクト設定を開く
2. 「Environment Variables」セクションに移動
3. 必要な環境変数を追加
4. 変更を保存し、必要に応じて再デプロイ

詳細は[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)を参照してください。
