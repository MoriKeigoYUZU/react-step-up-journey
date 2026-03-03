# Chapter 13: カスタムフック - 自分だけのツールを作る

## カスタムフックとは？

これまでの章で、React が提供するフック（useState, useEffect, useReducer, useContext）を学んできました。
でも、同じようなロジックを複数のコンポーネントで使いたくなることがあります。

```tsx
// コンポーネントA: ON/OFF の切り替え
function ModalController() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prev => !prev);
  // ...
}

// コンポーネントB: こっちも ON/OFF の切り替え
function SidebarController() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prev => !prev);
  // ...
}
```

同じコード、コピペしていますよね？

**カスタムフック** を使えば、この共通ロジックを **1つの関数にまとめて** 再利用できます。

### アナロジー: レシピカード

料理をするとき、毎回レシピを暗記して最初から考えますか？
いいえ、**レシピカード**（レシピ本）に書いておいて、必要なときに取り出しますよね。

カスタムフックは **「ロジックのレシピカード」** です。

- **レシピカード（カスタムフック）**: 「ON/OFF を切り替える方法」を書いたカード
- **料理する人（コンポーネント）**: レシピカードを見て料理する
- **別の人（別のコンポーネント）**: 同じレシピカードを使って同じ料理を作れる

```tsx
// レシピカード = カスタムフック
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle, setValue] as const;
}

// 誰でも使える！
function ModalController() {
  const [isOpen, toggle] = useToggle();
  // ...
}

function SidebarController() {
  const [isOpen, toggle] = useToggle();
  // ...
}
```

---

## カスタムフックのルール

カスタムフックには守るべきルールがあります。
これらは React のフック全般に共通するルールです。

### ルール1: 名前は `use` で始める

```tsx
// ✅ 正しい命名
function useToggle() { ... }
function useCounter() { ... }
function useFetch() { ... }

// ❌ ダメな命名
function toggle() { ... }      // "use" がない
function getToggle() { ... }   // "use" がない
```

**なぜ？** React は `use` で始まる関数を「フック」として認識します。
ESLint（コードチェックツール）も `use` で始まる関数に対して
フックのルールを適用してくれます。

### ルール2: トップレベルでのみ呼ぶ

```tsx
// ❌ ダメ: 条件文の中で呼ぶ
function MyComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState('');  // NG!
  }
}

// ❌ ダメ: ループの中で呼ぶ
function MyComponent({ items }) {
  for (const item of items) {
    const [count, setCount] = useState(0);  // NG!
  }
}

// ✅ OK: コンポーネントの一番上で呼ぶ
function MyComponent({ isLoggedIn }) {
  const [name, setName] = useState('');  // OK!
  // ...
}
```

**なぜ？** React はフックを **呼ばれた順番** で管理しているからです。

### アナロジー: 出席簿

学校の先生が出席簿をつけるとき、**名前の順番** で呼びますよね。

```
1番: 佐藤 → useState('') → name
2番: 田中 → useState(0)  → count
3番: 鈴木 → useEffect    → API呼び出し
```

もし「今日は田中さんがいないから飛ばす」としたら？

```
1番: 佐藤 → useState('') → name
// 2番をスキップ！
3番: 鈴木 → useState(0)  → ???  ← ズレた！count だと思っている
```

React は **「何番目のフックか」** で state を特定しています。
条件分岐やループでフックを呼ぶと、順番がズレて **バグの原因** になります。

### ルール3: React の関数内でのみ呼ぶ

```tsx
// ✅ OK: React コンポーネントの中
function MyComponent() {
  const [count, setCount] = useState(0);
}

// ✅ OK: カスタムフックの中
function useCounter() {
  const [count, setCount] = useState(0);
}

// ❌ ダメ: 普通の関数の中
function calculateTotal() {
  const [total, setTotal] = useState(0);  // NG!
}
```

---

## カスタムフックの作り方

### 基本パターン

```tsx
// 1. 名前は "use" で始める
// 2. 内部で React のフックを使う
// 3. 必要な値や関数を返す

function useToggle(initialValue: boolean = false) {
  // 内部で useState を使う
  const [value, setValue] = useState(initialValue);

  // ロジックを関数として定義
  const toggle = () => setValue(prev => !prev);

  // 使う側が必要なものを返す
  return [value, toggle, setValue] as const;
}
```

### 返り値のパターン

カスタムフックの返り値には、いくつかのパターンがあります。

```tsx
// パターン1: 配列で返す（useState のように）
function useToggle(): [boolean, () => void] {
  // ...
  return [value, toggle];
}
// 使い方: const [isOpen, toggleOpen] = useToggle();
// → 好きな名前をつけられる（配列の分割代入）

// パターン2: オブジェクトで返す（値が多い場合）
function useCounter(): { count: number; increment: () => void; decrement: () => void } {
  // ...
  return { count, increment, decrement };
}
// 使い方: const { count, increment } = useCounter();
// → 必要なものだけ取り出せる（オブジェクトの分割代入）
```

**使い分けの目安**:
- 返す値が **2〜3個** → 配列
- 返す値が **4個以上** → オブジェクト

---

## カスタムフックのテスト: renderHook

カスタムフックは **コンポーネントの外で直接呼ぶことができません**（ルール3）。
でも、テストしたいですよね。

そこで `@testing-library/react` の **`renderHook`** を使います。

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increment で count が増える', () => {
  // renderHook でフックをテスト環境で実行
  const { result } = renderHook(() => useCounter());

  // result.current で現在の返り値にアクセス
  expect(result.current.count).toBe(0);

  // state を変更する操作は act() で囲む
  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

**ポイント**:
- `renderHook` = 「仮のコンポーネント内でフックを呼んでくれる」ユーティリティ
- `result.current` = フックの現在の返り値
- `act()` = state の更新を反映させるためのラッパー

---

## よくあるカスタムフックのパターン

### useToggle: ON/OFF の切り替え

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle, setValue] as const;
}
```

### useCounter: カウンター

```tsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
}
```

### useFetch: データ取得

```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

---

## カスタムフックで「関心の分離」を実現する

カスタムフックの本当の価値は、**ロジックとUIを分離** できることです。

### Before: ロジックとUIが混在

```tsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const addTodo = () => {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
    setText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // ↑ ロジック ↓ UI が混在している

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addTodo}>追加</button>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => toggleTodo(todo.id)}>
          {todo.text}
        </div>
      ))}
    </div>
  );
}
```

### After: カスタムフックでロジックを分離

```tsx
// ロジック（カスタムフック）
function useTodos() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return { todos, addTodo, toggleTodo };
}

// UI（コンポーネント）
function TodoList() {
  const { todos, addTodo, toggleTodo } = useTodos();
  const [text, setText] = useState('');

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => { addTodo(text); setText(''); }}>追加</button>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => toggleTodo(todo.id)}>
          {todo.text}
        </div>
      ))}
    </div>
  );
}
```

**メリット**:
- ロジックだけを独立してテストできる
- 同じロジックを別のUIで再利用できる
- コードが読みやすくなる

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | useToggle | 基本的なカスタムフックの作り方 |
| 02 | useCounter | オプション付きのカスタムフック |
| 03 | useFetch | useEffect を使ったカスタムフック |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/13-custom-hooks
```

---

## まとめ

- **カスタムフック** は「ロジックのレシピカード」。共通ロジックを再利用可能にする
- 名前は **`use` で始める**（React がフックとして認識するため）
- フックのルール: **トップレベルで呼ぶ**、**条件やループの中で呼ばない**、**React 関数内で呼ぶ**
- React はフックを **呼び出し順** で管理している（出席簿のアナロジー）
- `renderHook` と `act` でカスタムフックをテストできる
- カスタムフックで **ロジックとUIを分離**（関心の分離）ができる
- 返り値は **配列**（少数の値）か **オブジェクト**（多数の値）で返す
