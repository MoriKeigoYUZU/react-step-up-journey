# Chapter 10: コンポジションパターン

## 「コンポジション」ってなに？

前の章では、コンポーネントを分割する方法を学びました。
この章では、分割したコンポーネントを **組み合わせる** パターンを学びます。

React には重要な設計思想があります:

> **「継承よりコンポジション（Composition over Inheritance）」**

これは「コンポーネントを拡張（継承）するのではなく、**組み合わせて** 新しい機能を作る」という考え方です。

### アナロジー: レゴブロック

レゴブロックを想像してください。

- **継承**: 「特別な大きなブロック」を1つ作って、全てをそこに詰め込む
- **コンポジション**: 小さなブロックを **組み合わせて** 好きな形を作る

React では、小さなコンポーネント（ブロック）を組み合わせて、大きなUI を構築します。
これがコンポジションの基本的な考え方です。

---

## スロットパターン: 決まった場所に自由な中身を入れる

### スロットパターンってなに？

前の章で学んだ `children` は、「1つの穴」にコンテンツを入れるパターンでした。
スロットパターンは、**複数の穴（スロット）** を用意して、それぞれに別のコンテンツを入れるパターンです。

### アナロジー: 新聞のレイアウト

新聞のレイアウトを想像してください:

```
┌─────────────────────────────┐
│         ヘッダー             │ ← header スロット
├─────────┬───────────────────┤
│         │                   │
│サイドバー│     本文           │ ← sidebar スロット + children スロット
│         │                   │
└─────────┴───────────────────┘
```

新聞のレイアウト（枠組み）は決まっていますが、**各スロットに入る内容は毎日変わります**。

- ヘッダーには今日のトップニュース
- サイドバーには天気予報
- 本文には記事

レイアウトコンポーネントは「枠組み」を提供し、中身は使う側が自由に決められます。

### コードで見てみよう

```tsx
import { ReactNode } from 'react';

type LayoutProps = {
  header: ReactNode;    // ヘッダースロット
  sidebar: ReactNode;   // サイドバースロット
  children: ReactNode;  // メインコンテンツスロット
};

function Layout({ header, sidebar, children }: LayoutProps) {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="body">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
```

使う側:
```tsx
function App() {
  return (
    <Layout
      header={<h1>マイサイト</h1>}
      sidebar={
        <nav>
          <a href="/">ホーム</a>
          <a href="/about">概要</a>
        </nav>
      }
    >
      <article>
        <h2>記事タイトル</h2>
        <p>記事の内容...</p>
      </article>
    </Layout>
  );
}
```

### Next.js のレイアウトとの関係

実は、Next.js の `layout.tsx` はまさにこのスロットパターンを使っています！

```tsx
// Next.js の layout.tsx（イメージ）
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>  {/* ← children スロット */}
        <Footer />
      </body>
    </html>
  );
}
```

React のスロットパターンを理解すると、Next.js のレイアウトシステムも自然に理解できます。

---

## コンパウンドコンポーネント: 一緒に動くコンポーネント群

### コンパウンドコンポーネントってなに？

**コンパウンドコンポーネント（Compound Components）** は、複数のコンポーネントが **チームとして協力して** 1つの機能を実現するパターンです。

### アナロジー: テレビとリモコン

テレビのリモコンを考えてみてください:

- **リモコン全体（親コンポーネント）**: テレビを操作するための「まとまり」
- **各ボタン（子コンポーネント）**: 音量ボタン、チャンネルボタン、電源ボタン

各ボタンは独立していますが、全て **同じテレビを操作** します。
1つのリモコンの中にまとまっていることで、使いやすくなっています。

### コードで見てみよう: アコーディオン

アコーディオン（クリックで展開/折りたたみ）は、コンパウンドコンポーネントの良い例です:

```tsx
// 使い方（完成イメージ）
<Accordion>
  <AccordionItem title="セクション1">
    セクション1の内容がここに入ります。
  </AccordionItem>
  <AccordionItem title="セクション2">
    セクション2の内容がここに入ります。
  </AccordionItem>
</Accordion>
```

この構造では:
- `Accordion`: 全体のコンテナ（リモコン本体）
- `AccordionItem`: 各セクション（各ボタン）。自分自身の開閉状態を管理

### 独立した状態管理

今回の演習では、各 `AccordionItem` が **自分自身の開閉状態を独立して管理** します。

```tsx
function AccordionItem({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

セクション1を開いてもセクション2には影響しません。各ボタンが独立して動作します。

### 発展: 共有状態パターン

実務では、「1つだけ開ける」アコーディオンも必要になります。
その場合、親コンポーネント（`Accordion`）が「どれが開いているか」を管理し、
子コンポーネント（`AccordionItem`）に伝えます。

これには **Context** を使いますが、それは Chapter 11 で学びます。
今の段階では「各アイテムが独立して動作する」パターンを理解しましょう。

---

## いつどのパターンを使うか？

| パターン | 使う場面 | 例 |
|----------|----------|-----|
| children | 1つの「穴」に中身を入れたい | Card, Modal, Dialog |
| スロットパターン | 複数の「穴」に中身を入れたい | Layout, Page, Dashboard |
| コンパウンドコンポーネント | 関連するコンポーネントをセットで使いたい | Accordion, Tabs, Menu, Select |

### 選び方のフローチャート

```
コンポーネントに「穴」がいくつ必要？
├── 1つ → children を使う
├── 複数 → スロットパターン（props として ReactNode を渡す）
└── 関連するコンポーネントのセット？ → コンパウンドコンポーネント
```

---

## 実務での応用

### UIライブラリの設計

多くのUIライブラリ（Material UI, Chakra UI, Radix UIなど）は、
コンパウンドコンポーネントパターンを積極的に使っています:

```tsx
// Radix UI の Dialog（イメージ）
<Dialog.Root>
  <Dialog.Trigger>開く</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>タイトル</Dialog.Title>
    <Dialog.Description>説明文</Dialog.Description>
  </Dialog.Content>
</Dialog.Root>
```

`Dialog.Root`, `Dialog.Trigger`, `Dialog.Content` などが
チームとして協力して、ダイアログ機能を実現しています。

### Next.js でのレイアウトパターン

Next.js の App Router では、スロットパターンが「Parallel Routes」として使われています:

```
app/
├── layout.tsx        ← スロットを定義
├── @sidebar/         ← sidebar スロット
│   └── page.tsx
└── @main/            ← main スロット
    └── page.tsx
```

React の基本パターンを理解していると、フレームワークの仕組みも理解しやすくなります。

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | スロットパターン | 複数のスロットを持つレイアウトコンポーネント |
| 02 | コンパウンドコンポーネント | Accordion と AccordionItem の実装 |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/10-composition-patterns
```

---

## まとめ

- **コンポジション** = コンポーネントを組み合わせて新しい機能を作ること
- **スロットパターン**: props として `ReactNode` を渡して、決まった場所に中身を入れる
- **コンパウンドコンポーネント**: 関連するコンポーネントがチームとして協力する
- React の「継承よりコンポジション」は、柔軟で再利用しやすいUIを作る基本方針
- これらのパターンは Next.js やUIライブラリでも広く使われている
