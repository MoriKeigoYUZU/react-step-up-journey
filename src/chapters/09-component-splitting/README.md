# Chapter 09: コンポーネント分割

## なぜコンポーネントを分割するのか？

ここまでの章で、React コンポーネントの基本を学んできました。
しかし、実際のアプリケーションを作ると、1つのコンポーネントがどんどん大きくなりがちです。

そこで大事なのが **コンポーネント分割** です。

### アナロジー: キッチンのステーション

レストランのキッチンを想像してください。

- **1つの巨大な作業台**: 全部の料理を1つの台で作る。材料もお皿も全部混ざって、カオスになる
- **専用ステーション**: 焼き場、揚げ場、盛り付け場。それぞれが自分の仕事に集中できる

コンポーネントも同じです:

- **1つの巨大なコンポーネント**: 全部の処理を1つのファイルに書く。読みにくく、変更しにくい
- **分割されたコンポーネント**: それぞれが1つの役割を持つ。読みやすく、変更しやすい

---

## 単一責任の原則（Single Responsibility Principle）

コンポーネントを分割するときの基本的な考え方は、**1つのコンポーネントには1つの責任** です。

```tsx
// NG: 1つのコンポーネントで全部やっている
function App() {
  return (
    <div>
      <div className="header">
        <h1>サイト名</h1>
        <nav>
          <a href="/">ホーム</a>
          <a href="/about">概要</a>
        </nav>
      </div>
      <div className="main">
        <h2>記事タイトル</h2>
        <p>記事の内容...</p>
        <p>記事の内容...</p>
      </div>
      <div className="footer">
        <p>&copy; 2024 My Site</p>
      </div>
    </div>
  );
}

// OK: 分割されている
function App() {
  return (
    <div>
      <Header />
      <Article title="記事タイトル" body="記事の内容..." />
      <Footer />
    </div>
  );
}
```

分割すると:
- **読みやすい**: `App` を見れば全体の構造がわかる
- **変更しやすい**: ヘッダーを変えたいなら `Header` だけ見ればいい
- **再利用しやすい**: `Footer` を他のページでも使える

---

## children prop: コンポーネントの中に何かを入れる

### children ってなに？

HTML では、タグの中に別の要素を入れることができますよね:

```html
<div>
  <p>この段落は div の「子」です</p>
</div>
```

React コンポーネントでも同じことができます。コンポーネントのタグの間に挟まれたものが **`children`** として渡されます。

```tsx
<Card>
  <p>この段落は Card の children です</p>
</Card>
```

### アナロジー: 額縁

`children` を使ったコンポーネントは **額縁** のようなものです。

- **額縁（コンポーネント）**: 固定されたデザイン（枠線、影、余白など）
- **中身（children）**: 何を入れるかは自由（写真、絵、証書...）

額縁は「中に何が入るか」を知る必要はありません。
ただ「中身を囲むこと」が仕事です。

### コードで見てみよう

```tsx
import { ReactNode } from 'react';

// 額縁コンポーネント
function Card({ children }: { children: ReactNode }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      {children}
    </div>
  );
}

// 使う側
function App() {
  return (
    <>
      <Card>
        <h2>お知らせ</h2>
        <p>新しい機能がリリースされました！</p>
      </Card>

      <Card>
        <img src="photo.jpg" alt="写真" />
        <p>素敵な写真です</p>
      </Card>
    </>
  );
}
```

同じ `Card` コンポーネントに、まったく違う中身を入れています。
これが `children` の力です。

### ReactNode 型

`children` の型には `ReactNode` を使います。これは React が表示できるものなら何でも受け取れる型です:

```tsx
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;  // JSX要素、文字列、数値、null、配列...何でもOK
};
```

`ReactNode` は以下のものを全て含みます:
- JSX要素: `<div>hello</div>`
- 文字列: `"hello"`
- 数値: `42`
- `null` / `undefined`
- 配列: `[<p>1</p>, <p>2</p>]`

---

## コンポーネントを分割するタイミング

「いつ分割すべきか？」は難しい問題です。以下のサインがあれば、分割を検討しましょう:

### サイン1: 繰り返しパターンがある

```tsx
// 繰り返しがある → 分割のチャンス！
function ProductList() {
  return (
    <div>
      <div className="product">
        <h3>りんご</h3>
        <p>200円</p>
      </div>
      <div className="product">
        <h3>バナナ</h3>
        <p>100円</p>
      </div>
      {/* 同じパターンが続く... */}
    </div>
  );
}

// 分割後
function ProductItem({ name, price }: { name: string; price: number }) {
  return (
    <div className="product">
      <h3>{name}</h3>
      <p>{price}円</p>
    </div>
  );
}

function ProductList() {
  return (
    <div>
      <ProductItem name="りんご" price={200} />
      <ProductItem name="バナナ" price={100} />
    </div>
  );
}
```

### サイン2: 独立したロジックがある

「この部分は独自のstateやeffectを持っている」なら、分割の候補です。

### サイン3: テストしたい単位がある

「この部分だけテストしたい」と思ったら、それはコンポーネントにすべきです。

---

## 再利用可能なコンポーネント: 色々な場面で使えるようにする

### Optional props で柔軟にする

コンポーネントを再利用可能にするコツは、**必要なところだけカスタマイズできるようにする** ことです。

TypeScript では `?` をつけると「あってもなくてもいい」プロパティになります:

```tsx
type AlertProps = {
  type: 'success' | 'error' | 'info';  // 必須
  message: string;                       // 必須
  onClose?: () => void;                  // オプション（あってもなくてもいい）
};

function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`alert-${type}`}>
      <p>{message}</p>
      {onClose && <button onClick={onClose}>閉じる</button>}
    </div>
  );
}
```

使う側:
```tsx
// 閉じるボタンなし
<Alert type="info" message="お知らせです" />

// 閉じるボタンあり
<Alert type="error" message="エラーです" onClose={() => setVisible(false)} />
```

`onClose` が渡されたときだけボタンを表示する。
これが **「柔軟で再利用可能なコンポーネント」** の基本パターンです。

### 条件付きレンダリングでオプション部分を制御

```tsx
{onClose && <button onClick={onClose}>閉じる</button>}
```

この `{条件 && JSX}` は「条件が true のときだけ JSX を表示する」パターンです。
`onClose` が `undefined`（渡されていない）なら何も表示されません。
`onClose` が関数（渡されている）なら、ボタンが表示されます。

---

## Before / After: 分割の実例

### Before: 全部が1つのコンポーネント

```tsx
function ShoppingCart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1>ショッピングカート</h1>
      {items.length === 0 ? (
        <p>カートは空です</p>
      ) : (
        <>
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span>{item.price * item.quantity}円</span>
              </li>
            ))}
          </ul>
          <div>
            <strong>合計: {total}円</strong>
          </div>
        </>
      )}
    </div>
  );
}
```

### After: 分割されたコンポーネント

```tsx
// 個別の商品を表示する責任
function CartItem({ name, price, quantity }: CartItemProps) {
  return (
    <li>
      <span>{name}</span>
      <span>{price * quantity}円</span>
    </li>
  );
}

// カート全体を管理する責任
function ShoppingCart({ items }: ShoppingCartProps) {
  if (items.length === 0) {
    return <p>カートは空です</p>;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1>ショッピングカート</h1>
      <ul>
        {items.map(item => (
          <CartItem key={item.id} name={item.name} price={item.price} quantity={item.quantity} />
        ))}
      </ul>
      <div>
        <strong>合計: {total}円</strong>
      </div>
    </div>
  );
}
```

分割後のメリット:
- `CartItem` だけ単体でテストできる
- `CartItem` のデザインを変えても `ShoppingCart` に影響しない
- `CartItem` を他の場所でも再利用できる

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | children prop | children を使ったコンポーネントの作り方 |
| 02 | 再利用可能コンポーネント | オプション props と条件付きレンダリング |
| 03 | コンポーネント抽出 | 大きなコンポーネントを分割する実践 |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/09-component-splitting
```

---

## まとめ

- **コンポーネント分割** は読みやすさ・変更しやすさ・再利用性を向上させる
- **children prop** を使うと、コンポーネントの中に自由に要素を配置できる
- `children` の型は `ReactNode` を使う
- **Optional props**（`?`）で柔軟なコンポーネントを作る
- 分割のサイン: 繰り返しパターン、独立したロジック、テストしたい単位
- 1つのコンポーネントには1つの責任（単一責任の原則）
