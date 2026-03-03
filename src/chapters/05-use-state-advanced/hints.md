# Chapter 05: useStateの応用 - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: オブジェクトの state

### レベル1（そっと後押し）
state をオブジェクト `{ name: '太郎', age: 20 }` にしましょう。
更新するとき、オブジェクトを**直接変更してはいけません**。
スプレッド構文 `{...prev}` で新しいオブジェクトを作ることを思い出してください。

### レベル2（もう少し具体的に）
- `useState({ name: '太郎', age: 20 })` で初期化
- 「名前を変更」ボタンの onClick で state を更新
- 更新するとき: `setUser({ ...user, name: '次郎' })` のように書く
- age はスプレッドでコピーされるので、明示的に指定しなくても残る

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function UserProfile() {
  const [user, setUser] = useState({ name: '太郎', age: 20 });

  return (
    <div>
      <p>名前: {user.name}</p>
      <p>年齢: {user.age}</p>
      <button onClick={() => setUser({ ...user, name: '次郎' })}>
        名前を変更
      </button>
    </div>
  );
}
```

---

## Exercise 02: 配列の state

### レベル1（そっと後押し）
配列の state とテキスト入力の state、2つの state が必要です。
追加は `[...prev, newItem]`、削除は `.filter()` を使います。
追加後にテキスト入力をクリアすることも忘れずに。

### レベル2（もう少し具体的に）
- `useState<string[]>([])` で空の配列を初期化
- `useState('')` でテキスト入力用の state を初期化
- 「追加」ボタン: `setItems([...items, text])` で追加し、`setText('')` でクリア
- 「削除」ボタン: 各アイテムに index を使って `setItems(items.filter((_, i) => i !== index))` で削除

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function TaskList() {
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState('');

  const handleAdd = () => {
    setItems([...items, text]);
    setText('');
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAdd}>追加</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => handleDelete(index)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Exercise 03: 関数型更新

### レベル1（そっと後押し）
「3回増やす」ボタンで、1回のクリックで3増やしたい。
`setCount(count + 1)` を3回書いても、なぜか1しか増えません。
README の「関数型更新」のセクションを読んでみてください。

### レベル2（もう少し具体的に）
- `setCount(count + 1)` は「count（今の値）+ 1 に設定して」という意味
- 3回書いても、全部同じ `count` を参照するので、結果は `count + 1`
- `setCount(prev => prev + 1)` なら「今の最新値 + 1」になる
- これを3回書けば、1→2→3 と順番に増える
- リセットは `setCount(0)` でOK

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function BatchCounter() {
  const [count, setCount] = useState(0);

  const handleTriple = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={handleTriple}>3回増やす</button>
      <button onClick={() => setCount(0)}>リセット</button>
    </div>
  );
}
```
`prev` という名前は何でもOKです（`p`, `current`, `c` など）。大事なのは「関数を渡す」形式であること。
