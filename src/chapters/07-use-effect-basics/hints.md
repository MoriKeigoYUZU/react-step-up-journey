# Chapter 07: useEffectの基本 - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: document.title

### レベル1（そっと後押し）
`useEffect` は「画面が描画された後に何かをする」ための仕組みです。
`document.title` を変更するのは、まさに「描画以外の処理」ですね。
`useEffect` の中で `document.title = ...` と書いてみましょう。

### レベル2（もう少し具体的に）
テストを見ると、3つの要件があります:
1. `title` props に応じて `document.title` を変更する → 依存配列に `title` を入れる
2. `title` が変わったら `document.title` も更新する → 依存配列のおかげで自動的にOK
3. アンマウント時に `document.title` を `''` に戻す → クリーンアップ関数（`return () => { ... }`）を書く

### レベル3（ほぼ答え）
```tsx
import { useEffect } from 'react';

export function PageTitle(props: { title: string }) {
  useEffect(() => {
    // ここで document.title を props.title に設定
    // return () => { ここで document.title を '' に戻す };
  }, [/* 何を監視すべき？ */]);

  return null;
}
```
`useEffect` の依存配列に `props.title` を入れて、クリーンアップ関数で `document.title = ''` とします。

---

## Exercise 02: タイマー

### レベル1（そっと後押し）
1秒ごとにカウントアップするには `setInterval` が使えます。
`useState` で秒数を管理して、`useEffect` の中で `setInterval` を動かしましょう。
そして、コンポーネントが消えるときには `clearInterval` で止めることを忘れずに！

### レベル2（もう少し具体的に）
必要なもの:
- `const [seconds, setSeconds] = useState(0);` で秒数を管理
- `useEffect` の中で `setInterval(() => setSeconds(s => s + 1), 1000)` を実行
- 依存配列は `[]`（マウント時に1回だけタイマーを開始）
- クリーンアップで `clearInterval(id)` する

### レベル3（ほぼ答え）
```tsx
import { useState, useEffect } from 'react';

export function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => s + 1);  // 関数形式で更新するのがポイント
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>経過: {seconds}秒</p>;
}
```
`setSeconds(seconds + 1)` ではなく `setSeconds(s => s + 1)` と関数形式にするのがポイントです。
なぜなら、`setInterval` の中では `seconds` の値が古いままになるからです。

---

## Exercise 03: 依存配列

### レベル1（そっと後押し）
このエクササイズは「依存配列に何を入れるべきか」を考える練習です。
テストを見ると:
- `message` が変わったら `onLog(message)` を呼ぶ
- `message` が同じなら呼ばない

依存配列に入れるべき値は何でしょう？

### レベル2（もう少し具体的に）
`useEffect` の中で `message` を使っています。
テストの要件は「`message` が変わったら実行する」「同じなら実行しない」。
ということは、依存配列に `message` を入れれば OK です。
`onLog` は依存配列に入れるべきでしょうか？テストの動作を確認してみてください。

### レベル3（ほぼ答え）
```tsx
import { useEffect } from 'react';

export function Logger(props: LoggerProps) {
  useEffect(() => {
    props.onLog(props.message);
  }, [props.message]);  // message だけを監視

  return null;
}
```
テストでは `onLog` が同じ参照で渡されているため、`message` だけを依存配列に入れれば要件を満たします。
（実務では ESLint が `onLog` も入れるよう警告しますが、今はこのパターンを理解することが目的です。）
