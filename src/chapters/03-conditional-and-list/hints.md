# Chapter 03: 条件分岐とリスト表示 - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: 条件分岐

### レベル1（そっと後押し）
`LoginStatus` は「2つの表示を切り替える」パターンです。`condition ? A : B` を使えそうですね。
`AdminBadge` は「条件を満たすときだけ表示する」パターンです。`condition && <要素>` を考えてみてください。

### レベル2（もう少し具体的に）
- `LoginStatus`: `isLoggedIn` が true なら `<p>ようこそ！</p>`、false なら `<p>ログインしてください</p>` を返す
- `AdminBadge`: `isAdmin` が true のときだけ `<span>管理者</span>` を表示する。false のときは何も表示しない（`null` でも OK）

### レベル3（ほぼ答え）
```tsx
export function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <p>{isLoggedIn ? 'ようこそ！' : 'ログインしてください'}</p>;
}

export function AdminBadge({ isAdmin }: { isAdmin: boolean }) {
  return /* isAdmin && <span>...</span> の形で */;
}
```
`AdminBadge` は `<>` や `<div>` で囲んでも、直接 `isAdmin ? <span>管理者</span> : null` としても OK です。

---

## Exercise 02: リスト表示

### レベル1（そっと後押し）
`.map()` を使って配列の各要素を `<li>` に変換しましょう。
テストを見ると、空配列のときは特別なメッセージを出す必要がありますね。
配列の長さをチェックする方法を考えてみてください。

### レベル2（もう少し具体的に）
構造としては:
1. `fruits.length === 0` のとき → `<p>フルーツがありません</p>` を返す
2. それ以外 → `<ul>` の中に `fruits.map()` で `<li>` を作る
3. 各 `<li>` には `key` を忘れずに（今回は文字列自体を key にしても OK）

### レベル3（ほぼ答え）
```tsx
export function FruitList({ fruits }: { fruits: string[] }) {
  if (fruits.length === 0) {
    return <p>フルーツがありません</p>;
  }

  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{/* ここにフルーツ名 */}</li>
      ))}
    </ul>
  );
}
```

---

## Exercise 03: オブジェクトのリスト

### レベル1（そっと後押し）
今回はオブジェクトの配列を表示します。
各 Todo には `id`, `title`, `done` があります。
`done` の値に応じて、`<li>` の `className` を変えてみましょう。
完了件数は `.filter()` で数えられます。

### レベル2（もう少し具体的に）
- `todos.map()` で各 todo を `<li>` に変換
- `key` には `todo.id` を使う
- `done` が true のときは `className="completed"` をつける
  - `className={todo.done ? 'completed' : ''}` のように
- 完了件数: `todos.filter(t => t.done).length` で計算できる

### レベル3（ほぼ答え）
```tsx
export function TodoList({ todos }: { todos: Todo[] }) {
  const completedCount = todos.filter((t) => t.done).length;

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={/* done に応じて */}>
            {todo.title}
          </li>
        ))}
      </ul>
      <p>完了: {completedCount}/{todos.length}</p>
    </div>
  );
}
```
`className` の部分に三項演算子を入れてみてください。
