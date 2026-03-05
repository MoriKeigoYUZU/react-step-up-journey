# Chapter 01: JSXの基本

## JSXってなに？

Reactを書くとき、最初に出会うのが **JSX** という書き方です。

一見HTMLのように見えますが、実は **JavaScript** です。

### JSXは「翻訳者」のようなもの

こんな風に考えてみてください。

あなたが友達に「この部屋をこう片付けて」とお願いするとき、自然な言葉で伝えますよね。
でも、コンピュータ（ブラウザ）は自然な言葉を理解できません。

JSXは、あなた（開発者）とブラウザの間に立つ **翻訳者** です。

- あなたは **読みやすい形式**（JSX）で「画面をこうしたい」と書く
- JSXが **ブラウザが理解できる形式**（JavaScript）に翻訳してくれる

```
あなたが書くもの（JSX）:
  <h1>こんにちは</h1>

ブラウザが受け取るもの（JavaScript）:
  React.createElement('h1', null, 'こんにちは')
```

---

## JSXの正体: React.createElement

JSXは見た目がHTMLに似ていますが、実際には `React.createElement()` という関数の呼び出しに変換されます。

### 変換の例

```tsx
// あなたが書くJSX
const element = <h1 className="title">Hello</h1>;

// ↓ 実際にはこう変換される（Babelというツールが変換）
const element = React.createElement('h1', { className: 'title' }, 'Hello');
```

もっと複雑な例:

```tsx
// JSX
const card = (
  <div className="card">
    <h2>タイトル</h2>
    <p>内容です</p>
  </div>
);

// ↓ 変換後
const card = React.createElement(
  'div',
  { className: 'card' },
  React.createElement('h2', null, 'タイトル'),
  React.createElement('p', null, '内容です')
);
```

JSXのほうが **圧倒的に読みやすい** ですよね。
だから React は JSX を採用しています。

---

## JSXの4つのルール

JSXにはHTMLとは違うルールがいくつかあります。
最初は戸惑うかもしれませんが、慣れれば自然に書けるようになります。

### ルール1: 必ず1つのルート要素で囲む

JSXは **1つの親要素** しか返せません。

```tsx
// NG: 2つの要素を並べて返せない
return (
  <h1>タイトル</h1>
  <p>内容</p>
);

// OK: div で囲む
return (
  <div>
    <h1>タイトル</h1>
    <p>内容</p>
  </div>
);

// OK: Fragment（<>...</>）で囲む（余計なDOMが増えない）
return (
  <>
    <h1>タイトル</h1>
    <p>内容</p>
  </>
);
```

なぜ？ JavaScriptの関数は **1つの値** しか返せないからです。
`React.createElement()` も1つの要素しか作れません。

### ルール2: `class` ではなく `className` を使う

HTMLでは `class` を使いますが、JSXでは `className` です。

```tsx
// HTML
<div class="container">...</div>

// JSX
<div className="container">...</div>
```

なぜ？ JavaScriptには `class` という予約語（クラス定義に使う）があるからです。
名前がぶつかるのを避けるために `className` になりました。

### ルール3: タグは必ず閉じる（自己閉じタグ）

HTMLでは `<img>` や `<br>` は閉じなくても動きますが、JSXでは必ず閉じます。

```tsx
// HTML（閉じなくてもOK）
<img src="photo.jpg">
<br>
<input type="text">

// JSX（必ず閉じる）
<img src="photo.jpg" />
<br />
<input type="text" />
```

### ルール4: JavaScriptの式は `{}` で囲む

JSXの中で JavaScript の値を使いたいときは、波括弧 `{}` で囲みます。

```tsx
const name = '太郎';
const age = 25;

return (
  <div>
    <h1>{name}のプロフィール</h1>
    <p>年齢: {age}歳</p>
    <p>来年: {age + 1}歳</p>
    <p>大人？: {age >= 20 ? 'はい' : 'いいえ'}</p>
  </div>
);
```

`{}` の中には **式（expression）** を書けます。

- 変数の値: `{name}`
- 計算: `{price * 1.1}`
- 三項演算子: `{condition ? 'A' : 'B'}`
- 関数呼び出し: `{getName()}`

ただし、`if文` や `for文` は **式ではなく文（statement）** なので書けません。

```tsx
// NG: if文は書けない
<p>{if (true) { 'hello' }}</p>

// OK: 三項演算子を使う
<p>{true ? 'hello' : 'bye'}</p>
```

---

## なぜReactはJSXを使うのか？

「HTMLとJavaScriptを分けたほうがいいのでは？」と思うかもしれません。

Reactの考え方は少し違います。

> **UIの構造（HTML）とロジック（JavaScript）は密接に関係している。**
> **だから一緒に書いたほうが、変更しやすく、理解しやすい。**

例えば、「ユーザーがログインしていたら名前を表示する」という機能を考えてください。

HTMLファイルとJSファイルが別々だと、両方を行き来して読む必要があります。
JSXなら、1つのコンポーネントの中で **構造とロジックが一目でわかります**。

```tsx
function UserGreeting({ isLoggedIn, name }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>ようこそ、{name}さん！</h1>
      ) : (
        <h1>ログインしてください</h1>
      )}
    </div>
  );
}
```

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | はじめてのJSX | JSXで要素を返す基本 |
| 02 | JSXの中で式を使う | `{}` を使った式の埋め込み |
| 03 | JSXのルール | className、自己閉じタグ、alt属性 |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. TODOコメントを確認する（これが「仕様」）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/01-jsx-basics
```

---

## まとめ

- JSXは **JavaScriptの中にHTMLのような構文を書ける仕組み**
- 実際には `React.createElement()` に変換される
- 4つのルール: ルート要素1つ、`className`、自己閉じタグ、`{}` で式
- JSXのおかげで **UIの構造とロジックを一緒に書ける**
