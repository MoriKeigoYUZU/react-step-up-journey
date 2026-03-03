# Chapter 04: useStateの基本 - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: カウンター

### レベル1（そっと後押し）
`useState` を import して使ってみましょう。
初期値は `0` です。ボタンをクリックしたときにセッター関数を呼ぶ必要があります。
`onClick` に関数を渡してみてください。

### レベル2（もう少し具体的に）
```tsx
import { useState } from 'react';
```
で useState を読み込みます。

`const [count, setCount] = useState(0);` で state を作ります。
ボタンの `onClick` で `setCount(count + 1)` を呼びます。

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```
`onClick` に渡すのは「関数そのもの」です。`onClick={setCount(count + 1)}` としてしまうと、レンダリング時に即実行されてしまうので注意！

---

## Exercise 02: トグル

### レベル1（そっと後押し）
ON/OFF は `true` / `false` で表現できます。
`useState(false)` で始めて、ボタンをクリックするたびに反転させましょう。
`true` を `false` にする方法...否定演算子 `!` を知っていますか？

### レベル2（もう少し具体的に）
- `useState(false)` で初期値を `false`（OFF）にする
- ボタンの onClick で `setIsOn(!isOn)` のように反転させる
- `isOn ? 'ON' : 'OFF'` で表示テキストを切り替える
- `data-testid="status"` を span に設定するのを忘れずに

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <span data-testid="status">{isOn ? 'ON' : 'OFF'}</span>
      <button onClick={() => setIsOn(!isOn)}>切り替え</button>
    </div>
  );
}
```

---

## Exercise 03: 名前表示

### レベル1（そっと後押し）
テキスト入力欄（`<input>`）の値を state で管理します。
ユーザーが文字を入力するたびに `onChange` イベントが発生します。
そのイベントから入力された値を取得して state を更新しましょう。

### レベル2（もう少し具体的に）
- `useState('')` で空文字列から始める
- `<input>` に `value={name}` と `onChange` を設定する
- `onChange` のイベントオブジェクトから `e.target.value` で入力値を取得
- `<p>` に `名前: {name}` と表示する

テストが `'名前:'`（空のとき）と `'名前: 太郎'`（入力後）を期待していることに注目してください。

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function NameDisplay() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>名前: {name}</p>
    </div>
  );
}
```
`value` と `onChange` を両方設定することで「制御コンポーネント」になります。これについては Chapter 06 で詳しく学びます。
