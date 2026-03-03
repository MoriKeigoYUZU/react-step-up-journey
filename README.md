# React Step-Up Journey

Claudeとペアプログラミングしながら React を基礎から体系的に学ぶプロジェクト。

## セットアップ

```bash
git clone <このリポジトリ>
cd react-step-up-journey
npm install
```

## 学習の流れ（1エクササイズあたり）

### 1. README を読む

各チャプターに `README.md` がある。まずこれを読んで概念を掴む。

```
src/chapters/01-jsx-basics/README.md  ← これ
```

### 2. テストを読む

テストファイルが「仕様書」。**何を作ればいいか**がここに書いてある。

```
src/chapters/01-jsx-basics/__tests__/01-first-jsx.test.tsx  ← これを読む
```

### 3. 実装する

`exercises/` の中のファイルを編集する。最初は `return null` になっているので、テストが求めるコードに書き換える。

```
src/chapters/01-jsx-basics/exercises/01-first-jsx.tsx  ← ここに書く
```

### 4. ブラウザで見る（任意）

`src/App.tsx` を開いて、今のエクササイズの import コメントを外す → `npm run dev` でブラウザに表示される。

```tsx
// src/App.tsx の中で、この行のコメントを外す
import { Greeting } from "./chapters/01-jsx-basics/exercises/01-first-jsx";

// <Preview> の中にコンポーネントを置く
<Preview>
  <Greeting />
</Preview>
```

### 5. テストを実行する

```bash
# チャプターまるごと
npm run test:chapter -- src/chapters/01-jsx-basics/

# 1つのエクササイズだけ
npx vitest run src/chapters/01-jsx-basics/__tests__/01-first-jsx.test.tsx

# ウォッチモード（ファイル保存で自動再実行）
npm test -- src/chapters/01-jsx-basics/
```

赤（FAIL）→ 緑（PASS）になれば成功！

### 6. Claude と議論する

テストが緑になったら終わりじゃない。Claude に話しかけて「なぜ動くのか」を一緒に考える。これが一番大事。

### 詰まったら

- 各チャプターの `hints.md` にヒントがある（3段階: 軽い → 中 → ほぼ答え）
- それでもダメなら Claude に聞く

## コマンドまとめ

| やりたいこと | コマンド |
|-------------|---------|
| 依存関係インストール | `npm install` |
| ブラウザで見る | `npm run dev` |
| 全テスト実行 | `npm test` |
| チャプター単位でテスト | `npm run test:chapter -- src/chapters/01-jsx-basics/` |
| 1つだけテスト | `npx vitest run src/chapters/01-jsx-basics/__tests__/01-first-jsx.test.tsx` |

## 進捗管理

`PROGRESS.md` に進捗が記録される。Claude が自動で更新してくれる。別PCで再開するときはこのファイルを見ればどこまでやったかわかる。

## 全体構成

全15チャプター。詳細は [ROADMAP.md](./ROADMAP.md) を参照。

| PART | テーマ | Chapter |
|------|--------|---------|
| 1 | 土台をつくる | 01-03 |
| 2 | 「状態」を理解する | 04-06 |
| 3 | 副作用を理解する | 07-08 |
| 4 | コンポーネント設計 | 09-10 |
| 5 | 状態管理の深掘り | 11-13 |
| 6 | パフォーマンスと実践 | 14-15 |

## ディレクトリ構造

```
src/chapters/XX-chapter-name/
├── README.md          ← 概念の説明（まず読む）
├── __tests__/         ← テスト = 仕様書（次に読む）
├── exercises/         ← ここに実装を書く
└── hints.md           ← 詰まったら見るヒント
```

## 技術スタック

- React 19 + TypeScript
- Vite（ビルドツール）
- Vitest + Testing Library（テスト）
