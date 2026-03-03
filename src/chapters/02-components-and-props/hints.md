# Chapter 02: コンポーネントとProps - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: 基本的なProps

### レベル1（そっと後押し）
`props` の中に `label` というデータが入ってきます。
それを `<button>` タグの中に表示するだけです。
`props.label` でアクセスできますよ。

### レベル2（もう少し具体的に）
関数の引数 `_props` のアンダースコアを外して `props` にしましょう。
そして `<button>{props.label}</button>` のように書いてみてください。
分割代入 `{ label }` を使っても OK です。

### レベル3（ほぼ答え）
```tsx
export function Button(props: ButtonProps) {
  return <button>{props.label}</button>;
}
```
または分割代入を使って:
```tsx
export function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}
```

---

## Exercise 02: 複数のProps

### レベル1（そっと後押し）
今回は `name`, `price`, `inStock` の3つの Props を受け取ります。
テストを見ると、`data-testid="price"` という属性が使われています。
JSX では `<span data-testid="price">` のように書けます。

### レベル2（もう少し具体的に）
- `h3` に `name` を表示
- `span` に `data-testid="price"` を設定して `{price}円` を表示
- `inStock` が `true` なら「在庫あり」、`false` なら「在庫なし」を表示
- 三項演算子 `inStock ? '在庫あり' : '在庫なし'` を使ってみよう

### レベル3（ほぼ答え）
```tsx
export function ProductCard({ name, price, inStock }: ProductCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <span data-testid="price">{/* price を使って */}円</span>
      <span>{/* inStock に応じて表示を切り替え */}</span>
    </div>
  );
}
```
`{}` の中に三項演算子を書いてみてください。

---

## Exercise 03: コンポーネント合成

### レベル1（そっと後押し）
3つのコンポーネント（Header, Footer, App）を作ります。
App コンポーネントでは、Header と Footer を **組み合わせて** 使います。
HTMLのセマンティックタグ（`<header>`, `<footer>`, `<main>`）を使ってみましょう。

### レベル2（もう少し具体的に）
- `Header`: `<header>` タグの中に「サイトタイトル」を書く
- `Footer`: `<footer>` タグの中に「© 2026」を書く
- `App`: `<Header />`, `<main>`, `<Footer />` を組み合わせる

テストでは `getByRole('banner')` が `<header>` を探し、
`getByRole('contentinfo')` が `<footer>` を探します。

### レベル3（ほぼ答え）
```tsx
export function Header() {
  return <header>サイトタイトル</header>;
}

export function Footer() {
  return <footer>© 2026</footer>;
}

export function App() {
  return (
    <div>
      <Header />
      <main>メインコンテンツ</main>
      <Footer />
    </div>
  );
}
```
