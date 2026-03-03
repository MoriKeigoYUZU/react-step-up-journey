# Chapter 12: useReducer - 複雑な状態管理をスッキリさせる

## useState の限界

Chapter 04-05 で学んだ `useState` は、シンプルな状態管理に最適でした。
でも、状態が複雑になると、こんな問題が出てきます。

```tsx
// カウンターなら useState で十分
const [count, setCount] = useState(0);

// でも、Todoリストは？
const [todos, setTodos] = useState<Todo[]>([]);
const [nextId, setNextId] = useState(1);

// 追加するとき、2つの state を同時に更新しないといけない
const addTodo = (title: string) => {
  setTodos([...todos, { id: nextId, title, done: false }]);
  setNextId(nextId + 1);  // これを忘れると ID が重複する！
};
```

**複数の state が連動** して変わる場合、`useState` だけで管理すると:

- 更新の抜け漏れが起きやすい
- 「どんな変更が起きたか」がコードから読み取りにくい
- テストが書きにくい

ここで登場するのが **`useReducer`** です。

---

## useReducer: 「何が起きたか」と「どう変わるか」を分ける

### アナロジー: レストランの注文システム

レストランを想像してください。

1. **お客さん（コンポーネント）** が「パスタください！」と注文する
2. **ウェイター（dispatch）** が注文を厨房に伝える
3. **シェフ（reducer）** が注文に応じて料理を作る
4. **料理（新しい state）** がお客さんのテーブルに届く

ポイントは **役割分担** です:

- お客さんは **「何が欲しいか」** を言うだけ（注文 = **アクション**）
- シェフは **「どう作るか」** を知っている（調理法 = **reducer**）
- ウェイターは **「伝える」** だけ（伝達 = **dispatch**）

コードに置き換えると:

```tsx
// アクション = 「何が起きたか」
{ type: 'ADD_TODO', title: '買い物に行く' }      // 「Todo を追加して」
{ type: 'TOGGLE_TODO', id: 1 }                    // 「この Todo の完了を切り替えて」
{ type: 'DELETE_TODO', id: 1 }                     // 「この Todo を削除して」

// Reducer = 「どう変わるか」
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':    // 追加の場合はこう変える
    case 'TOGGLE_TODO': // 切り替えの場合はこう変える
    case 'DELETE_TODO': // 削除の場合はこう変える
  }
}
```

---

## Reducer 関数: 純粋関数として設計する

**Reducer** は「現在の state」と「何が起きたか（action）」を受け取り、「新しい state」を返す関数です。

```tsx
function reducer(state: State, action: Action): State {
  // action に応じて新しい state を計算して返す
}
```

### 重要なルール: Reducer は「純粋関数」

**純粋関数** とは、同じ入力に対して必ず同じ出力を返す関数のことです。

```tsx
// 純粋関数 ✅
function add(a: number, b: number) {
  return a + b;  // 入力が同じなら結果は必ず同じ
}

// 純粋でない関数 ❌
function addRandom(a: number) {
  return a + Math.random();  // 毎回違う結果
}
```

Reducer で **やってはいけないこと**:
- state を直接変更する（ミュータブルな操作）
- API を呼ぶ
- ランダムな値を使う
- Date.now() を使う

```tsx
// ❌ ダメな例: state を直接変更
function badReducer(state, action) {
  state.count += 1;  // NG: 直接変更
  return state;
}

// ✅ 良い例: 新しいオブジェクトを返す
function goodReducer(state, action) {
  return { ...state, count: state.count + 1 };  // OK: 新しいオブジェクト
}
```

### なぜ純粋関数である必要があるか？

純粋関数だと **テストがとても簡単** になります。

```tsx
// Reducer のテストは入力と出力を確認するだけ！
test('INCREMENT で count が 1 増える', () => {
  const state = { count: 5 };
  const action = { type: 'INCREMENT' };
  const result = counterReducer(state, action);
  expect(result).toEqual({ count: 6 });
});
```

コンポーネントをレンダーする必要もなく、ボタンをクリックする必要もありません。
**入力を渡して、出力を確認する** だけです。

---

## switch/case パターン

Reducer では、`switch/case` を使ってアクションの種類ごとに処理を分岐するのが定番です。

```tsx
type State = { count: number };

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' };

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };

    case 'DECREMENT':
      return { count: state.count - 1 };

    case 'RESET':
      return { count: 0 };
  }
}
```

### TypeScript の判別可能ユニオン型（Discriminated Unions）

上の `Action` 型に注目してください。

```tsx
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' };
```

`type` プロパティの文字列リテラルによって、アクションの種類が **一意に決まります**。
これを **判別可能ユニオン型** と呼びます。

TypeScript がアクションの種類を理解してくれるので、`switch/case` の中で
**そのアクション固有のプロパティ** に安全にアクセスできます。

```tsx
type Action =
  | { type: 'ADD'; title: string }      // ADD は title を持つ
  | { type: 'DELETE'; id: number }      // DELETE は id を持つ
  | { type: 'CLEAR' };                  // CLEAR は追加データなし

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      // ここでは action.title にアクセスできる（TypeScript が型を絞り込む）
      return { ...state, items: [...state.items, action.title] };
    case 'DELETE':
      // ここでは action.id にアクセスできる
      return { ...state, items: state.items.filter(item => item.id !== action.id) };
    case 'CLEAR':
      return { ...state, items: [] };
  }
}
```

---

## useReducer の使い方

```tsx
import { useReducer } from 'react';

function Counter() {
  // useReducer(reducer関数, 初期state)
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>カウント: {state.count}</p>
      {/* dispatch でアクションを送る = ウェイターに注文する */}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>リセット</button>
    </div>
  );
}
```

`useReducer` が返すもの:
- `state`: 現在の状態
- `dispatch`: アクションを送る関数（ウェイター）

`dispatch({ type: 'INCREMENT' })` を呼ぶと:
1. `counterReducer` が呼ばれる
2. 現在の `state` と `{ type: 'INCREMENT' }` が渡される
3. 新しい state が返される
4. コンポーネントが再レンダーされる

---

## useState vs useReducer: いつ使い分ける？

### useState が向いているケース

```tsx
// シンプルな値の管理
const [name, setName] = useState('');
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);
```

- 1つの独立した値
- 更新ロジックがシンプル
- 次の state が前の state に依存しない

### useReducer が向いているケース

```tsx
// 複数の関連する値が連動して変わる
const [state, dispatch] = useReducer(todoReducer, {
  todos: [],
  nextId: 1,
  filter: 'all',
});
```

- **複数の state が連動** して変わる（todos と nextId など）
- **次の state が前の state に依存** する
- **更新パターンが複数** ある（追加、削除、切り替え、フィルタ...）
- **ロジックをテストしたい**（reducer は純粋関数だからテストが簡単）

### アナロジー: 電卓 vs レジ

- **電卓**（useState）: 「5」「+」「3」「=」→ シンプルな操作
- **レジ**（useReducer）: 商品追加、割引適用、税計算、ポイント付与 → 複数の操作が state に影響

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | カウンター Reducer | reducer 関数の基本、useReducer の使い方 |
| 02 | Todo Reducer | 複雑な状態管理（追加・切替・削除） |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/12-use-reducer
```

---

## まとめ

- **useReducer** は「何が起きたか（action）」と「どう変わるか（reducer）」を分離する
- **Reducer** は純粋関数: 同じ入力 → 同じ出力、副作用なし
- **dispatch** でアクションを送り、reducer が新しい state を計算する
- **switch/case** でアクションの種類ごとに処理を分岐する
- **TypeScript の判別可能ユニオン型** でアクションを型安全に扱える
- useState = シンプルな状態、useReducer = 複雑な状態管理に使う
- Reducer が純粋関数だから **テストが書きやすい** のが大きなメリット
