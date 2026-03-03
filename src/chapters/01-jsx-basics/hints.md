# Chapter 01: JSXの基本 - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: はじめてのJSX

### レベル1（そっと後押し）
コンポーネントは **JSXを返す関数** です。`return` の後に、表示したい要素を書いてみましょう。
h1 タグと p タグ、それぞれどんなテキストを表示すればいいか、テストを読んでみてください。

### レベル2（もう少し具体的に）
2つの要素（h1 と p）を返す必要があります。
JSXのルールを思い出してください。複数の要素を返すにはどうすればいいですか？
`<div>` や `<>...</>` で囲むことを考えてみましょう。

### レベル3（ほぼ答え）
```tsx
export function Greeting() {
  return (
    <div>
      <h1>/* ここにテストが求めるテキスト */</h1>
      <p>/* ここにテストが求めるテキスト */</p>
    </div>
  );
}
```
テストをもう一度見て、h1 と p にそれぞれ何を入れるべきか確認してください。

---

## Exercise 02: JSXの中で式を使う

### レベル1（そっと後押し）
JSXの中で JavaScript の変数を使うには `{}` で囲みます。
`props` からもらった値を `{}` の中に入れて使えますよ。

### レベル2（もう少し具体的に）
- `UserCard`: props から `name` を取り出して、`{name}` として h2 の中で使います。
- `PriceTag`: 税込価格は `price * (1 + tax)` で計算できます。`{}` の中で計算式が書けることを思い出してください。

### レベル3（ほぼ答え）
```tsx
export function UserCard(props: { name: string }) {
  return <h2>名前: {props.name}</h2>;
}

export function PriceTag(props: { price: number; tax: number }) {
  // ここで props.price と props.tax を使って
  // 「価格: {price}円」と「税込: {計算結果}円」を表示する
  // 計算: props.price + props.price * props.tax
  return (
    <div>
      <p>価格: {/* ??? */}円</p>
      <p>税込: {/* ??? */}円</p>
    </div>
  );
}
```

---

## Exercise 03: JSXのルール

### レベル1（そっと後押し）
このエクササイズでは JSX の3つのルールを実践します。
- HTMLの `class` は JSX では何になる？
- `<img>` タグは JSX ではどう書く？
- 全体を1つの要素で囲む必要がある

### レベル2（もう少し具体的に）
テストが求めている要素:
1. `div` に `className="profile-card"` を設定する
2. `img` に `alt="プロフィール画像"` を設定し、自己閉じタグ `/>` で書く
3. `h2` に名前、`p` に自己紹介を入れる

### レベル3（ほぼ答え）
```tsx
export function ProfileCard() {
  return (
    <div className="profile-card">
      <img src="https://via.placeholder.com/150" alt="/* テストが求める alt */" />
      <h2>/* テストが求める名前 */</h2>
      <p>/* テストが求める自己紹介 */</p>
    </div>
  );
}
```
テストを見て、具体的な文字列を確認してください。
