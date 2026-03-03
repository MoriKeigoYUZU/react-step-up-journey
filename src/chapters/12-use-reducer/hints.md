# Chapter 12: useReducer - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: カウンター Reducer

### レベル1（そっと後押し）
まず `counterReducer` 関数から取り組みましょう。
`switch (action.type)` で分岐して、各ケースで新しい state を返します。
テストが「単体テスト」として reducer を直接呼んでいるのに注目してください。
reducer は純粋関数なので、コンポーネントなしでテストできるんです。

### レベル2（もう少し具体的に）
Reducer のロジック:
- `INCREMENT`: `{ count: state.count + 1 }` を返す
- `DECREMENT`: `count` が 0 より大きければ `-1`、そうでなければそのまま
- `RESET`: `{ count: 0 }` を返す

コンポーネント側:
- `useReducer(counterReducer, { count: 0 })` で state と dispatch を取得
- `dispatch({ type: 'INCREMENT' })` のようにアクションを送る

### レベル3（ほぼ答え）
```tsx
export function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: Math.max(0, state.count - 1) };
    case 'RESET':
      return { count: 0 };
  }
}

export function CounterWithReducer() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  return (
    <div>
      <p>カウント: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>増やす</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>減らす</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>リセット</button>
    </div>
  );
}
```
`useReducer` は `import { useReducer } from 'react'` で使えます。

---

## Exercise 02: Todo Reducer

### レベル1（そっと後押し）
Exercise 01 のパターンを応用して、Todo のリストを管理しましょう。
state が `{ todos: Todo[], nextId: number }` というオブジェクトになります。
ADD、TOGGLE、DELETE の3つのアクションを `switch/case` で処理します。

### レベル2（もう少し具体的に）
Reducer のロジック:
- `ADD`: `todos` に新しいアイテム `{ id: state.nextId, title: action.title, done: false }` を追加し、`nextId` を +1
- `TOGGLE`: `todos.map()` で該当 id の `done` を反転（`!todo.done`）
- `DELETE`: `todos.filter()` で該当 id を除外

コンポーネント側:
- `useState` で入力テキストを管理
- テキスト入力 + 「追加」ボタンで `dispatch({ type: 'ADD', title: text })`
- Todo クリックで `dispatch({ type: 'TOGGLE', id: todo.id })`
- 「削除」ボタンで `dispatch({ type: 'DELETE', id: todo.id })`

### レベル3（ほぼ答え）
```tsx
export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        todos: [...state.todos, { id: state.nextId, title: action.title, done: false }],
        nextId: state.nextId + 1,
      };
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo
        ),
      };
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id),
      };
  }
}
```
コンポーネント側では、Todo のテキストをクリックして完了を切り替えるときに
`style={{ textDecoration: todo.done ? 'line-through' : 'none' }}` を使います。
「追加」ボタンの後にテキスト入力をクリアすることも忘れずに。
