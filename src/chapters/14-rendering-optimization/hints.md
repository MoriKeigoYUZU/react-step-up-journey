# Chapter 14: レンダリング最適化 - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: React.memo

### レベル1（そっと後押し）
この演習では、同じコンポーネントを「memo なし」と「memo あり」の2パターンで作ります。
`useRef` でレンダー回数を追跡するのがポイントです。
テストを見ると、memo なしの親では子のレンダー回数が増え、memo ありの親では増えないことを確認しています。

### レベル2（もう少し具体的に）
`ExpensiveList`:
- `useRef(0)` でレンダーカウントを追跡。コンポーネント本体で `renderCount.current += 1`
- `data-testid="render-count"` で表示
- `items` を `<ul>` + `<li>` で表示。各 `<li>` に `onClick` で `onItemClick(item)`

`ParentWithoutMemo`:
- `useState(0)` で count を管理。「親のカウント+1」ボタン
- `ExpensiveList` に固定の `items` と `onItemClick` を渡す

`ParentWithMemo`:
- 同じ構造だが `MemoizedExpensiveList` を使う
- `useCallback` で `onItemClick` の参照を安定させる
- `items` 配列はコンポーネント外で定義するか、`useMemo` で安定させる

### レベル3（ほぼ答え）
```tsx
const ITEMS = ['A', 'B', 'C'];  // コンポーネント外に定義

export function ExpensiveList(props: ExpensiveListProps) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div>
      <span data-testid="render-count">{renderCount.current}</span>
      <ul>
        {props.items.map(item => (
          <li key={item} onClick={() => props.onItemClick(item)}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ParentWithoutMemo() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>親のカウント+1</button>
      <ExpensiveList items={ITEMS} onItemClick={() => {}} />
    </div>
  );
}

export function ParentWithMemo() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback((_item: string) => {}, []);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>親のカウント+1</button>
      <MemoizedExpensiveList items={ITEMS} onItemClick={handleClick} />
    </div>
  );
}
```
`ParentWithMemo` で `count` の `void` 処理（`void count` や `<span style={{display:'none'}}>{count}</span>` など）を使って
TypeScript の未使用変数エラーを回避してください。

---

## Exercise 02: useMemo と useCallback

### レベル1（そっと後押し）
`FilteredList` は `items` と `threshold` を受け取り、`threshold` 以上のアイテムだけを表示します。
テストを見ると、検索ボックス（textbox）に入力しても、フィルタ結果が変わらないことを確認しています。
`useMemo` でフィルタ結果をメモ化し、検索入力による再計算を防ぎます。

### レベル2（もう少し具体的に）
- `useState` で検索テキスト（textbox 用）を管理
- `useMemo` で `items.filter(item => item >= threshold)` をメモ化
- 依存配列は `[items, threshold]`（検索テキストは含めない）
- `data-testid="count"` に `{filteredItems.length}件` と表示
- textbox の `onChange` で検索テキストを更新（フィルタとは無関係）

### レベル3（ほぼ答え）
```tsx
import { useState, useMemo } from 'react';

export function FilteredList(props: { items: number[]; threshold: number }) {
  const [_searchText, setSearchText] = useState('');

  const filteredItems = useMemo(
    () => props.items.filter(item => item >= props.threshold),
    [props.items, props.threshold]
  );

  return (
    <div>
      <input
        type="text"
        value={_searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      <p data-testid="count">{filteredItems.length}件</p>
      <ul>
        {filteredItems.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```
この演習のポイントは、「検索ボックスに入力しても、useMemo のおかげでフィルタ計算は
再実行されない」ということです。依存配列に `searchText` が入っていないからです。
