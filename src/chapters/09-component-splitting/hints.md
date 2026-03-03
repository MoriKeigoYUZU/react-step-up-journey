# Chapter 09: コンポーネント分割 - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: children prop

### レベル1（そっと後押し）
`children` は、コンポーネントのタグの間に挟まれた中身を受け取る特別な props です。
テストを見ると、`Card` コンポーネントは:
- `title` を `h2` で表示する
- `children` をそのまま表示する
- 全体を `className="card"` の `div` で囲む

### レベル2（もう少し具体的に）
props から `title` と `children` を取り出して使います:

```tsx
function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      {/* title を h2 で表示 */}
      {/* children をそのまま表示 */}
    </div>
  );
}
```

`children` は `{children}` と書くだけで中身がレンダリングされます。

### レベル3（ほぼ答え）
```tsx
export function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```
シンプルですよね！ `children` を受け取って表示するだけです。

---

## Exercise 02: 再利用可能コンポーネント

### レベル1（そっと後押し）
`Alert` コンポーネントは `type` に応じて className を変え、`onClose` が指定されたときだけボタンを表示します。
テストをよく読むと、3つの要件があります:
1. `className` は `alert-{type}` の形式
2. `message` を `p` タグで表示
3. `onClose` があるときだけ「閉じる」ボタンを表示

### レベル2（もう少し具体的に）
`className` の動的設定:
```tsx
<div className={`alert-${type}`}>
```

オプショナルなボタン:
```tsx
{onClose && <button onClick={onClose}>閉じる</button>}
```

`onClose` は `?` がついているので `undefined` の場合があります。
`onClose && ...` で、`undefined` のときはボタンを表示しません。

### レベル3（ほぼ答え）
```tsx
export function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`alert-${type}`}>
      <p>{message}</p>
      {onClose && <button onClick={onClose}>閉じる</button>}
    </div>
  );
}
```

---

## Exercise 03: コンポーネント抽出

### レベル1（そっと後押し）
このエクササイズでは2つのコンポーネントを実装します:
- `CartItem`: 個別の商品（名前と小計を表示）
- `ShoppingCart`: カート全体（商品一覧と合計金額を表示）

テストを見ると、`CartItem` は `name`, `price`, `quantity` を受け取って、
商品名と小計（price * quantity）を表示します。

### レベル2（もう少し具体的に）
`CartItem`:
- `name` と `{price * quantity}円` を表示する

`ShoppingCart`:
- `items` が空なら「カートは空です」を表示
- 空でなければ、各アイテムを `CartItem` でリスト表示
- 合計金額を `data-testid="total"` の要素に表示
- 合計は `items.reduce((sum, item) => sum + item.price * item.quantity, 0)` で計算

### レベル3（ほぼ答え）
```tsx
export function CartItem({ name, price, quantity }: { name: string; price: number; quantity: number }) {
  return (
    <div>
      <span>{name}</span>
      <span>{price * quantity}円</span>
    </div>
  );
}

export function ShoppingCart({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return <p>カートは空です</p>;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      {items.map(item => (
        <CartItem key={item.id} name={item.name} price={item.price} quantity={item.quantity} />
      ))}
      <p data-testid="total">{total}円</p>
    </div>
  );
}
```
`data-testid` はテストから要素を見つけるための属性です。画面には影響しません。
