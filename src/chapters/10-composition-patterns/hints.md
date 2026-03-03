# Chapter 10: コンポジションパターン - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: スロットパターン

### レベル1（そっと後押し）
`Layout` コンポーネントは3つの「穴」を持っています:
- `header` → `<header>` タグの中に入れる
- `sidebar` → `<aside>` タグの中に入れる
- `children` → `<main>` タグの中に入れる

それぞれの props を、対応する HTML タグの中に配置するだけです。

### レベル2（もう少し具体的に）
テストを見ると、ロール（role）で要素を探しています:
- `banner` は `<header>` タグに対応
- `complementary` は `<aside>` タグに対応
- `main` は `<main>` タグに対応

props を分割代入で取り出して、それぞれのタグの中に配置しましょう:
```tsx
function Layout({ header, sidebar, children }: LayoutProps) {
  // header → <header> の中
  // sidebar → <aside> の中
  // children → <main> の中
}
```

### レベル3（ほぼ答え）
```tsx
export function Layout({ header, sidebar, children }: LayoutProps) {
  return (
    <div>
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}
```
シンプルですよね。各 props を対応する HTML タグの中に置くだけです。

---

## Exercise 02: コンパウンドコンポーネント

### レベル1（そっと後押し）
2つのコンポーネントを実装します:
- `Accordion`: children をそのまま表示するだけのコンテナ
- `AccordionItem`: クリックで展開/折りたたみできる各セクション

`AccordionItem` が一番重要です。テストを見ると:
- 最初は内容が非表示
- ボタンをクリックすると表示
- もう一度クリックすると非表示
- 各アイテムは独立して動作

### レベル2（もう少し具体的に）
`Accordion` は本当にシンプルで、`children` をそのまま返すだけです。

`AccordionItem` には `useState` が必要です:
- `const [isOpen, setIsOpen] = useState(false);`
- `title` を `<button>` で表示
- クリックで `isOpen` を切り替え
- `isOpen` が `true` のときだけ `children` を表示

```tsx
{isOpen && <div>{children}</div>}
```

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function Accordion({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```
各 `AccordionItem` が自分の `isOpen` 状態を持っているので、独立して動作します。
`useState` は各コンポーネントのインスタンスごとに独立していることを思い出してください。
