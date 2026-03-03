# Chapter 13: カスタムフック - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: useToggle

### レベル1（そっと後押し）
`useToggle` は `useState` をラップするだけのシンプルなフックです。
`useState` で boolean 値を管理し、`toggle` 関数で値を反転させます。
返り値は `[value, toggle, setValue]` の配列です。

`ToggleDemo` コンポーネントでは、`useToggle` を使って ON/OFF を切り替えるだけです。

### レベル2（もう少し具体的に）
```tsx
function useToggle(initialValue = false) {
  // useState で value を管理
  // toggle: () => setValue(prev => !prev)
  // return [value, toggle, setValue]
}
```

`ToggleDemo` では:
- `useToggle()` の返り値から `value` と `toggle` を取り出す
- `value ? 'ON' : 'OFF'` でテキストを切り替える
- ボタンのテキストは「切り替え」

### レベル3（ほぼ答え）
```tsx
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle, setValue];
}

export function ToggleDemo() {
  const [value, toggle] = useToggle();
  return (
    <div>
      <p>{value ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>切り替え</button>
    </div>
  );
}
```
`useState` を `import { useState } from 'react'` でインポートするのを忘れずに。

---

## Exercise 02: useCounter

### レベル1（そっと後押し）
Exercise 01 の応用です。`useCounter` は `useState` に加えて、
オプション（step, min, max）を受け取ります。

テストを見ると:
- `step` が指定されたら、increment/decrement はその分だけ増減
- `min` が指定されたら、それ以下にならない
- `max` が指定されたら、それ以上にならない
- `reset` で初期値に戻る

### レベル2（もう少し具体的に）
```tsx
function useCounter(initialValue = 0, options = {}) {
  const { step = 1, min, max } = options;
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(prev => {
      const next = prev + step;
      // max が指定されていて、next が max を超えるなら max を返す
      return max !== undefined ? Math.min(next, max) : next;
    });
  };
  // decrement も同様に min をチェック
  // reset は setCount(initialValue)
}
```

### レベル3（ほぼ答え）
```tsx
export function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const { step = 1, min, max } = options;
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(prev => {
      const next = prev + step;
      return max !== undefined ? Math.min(next, max) : next;
    });
  };

  const decrement = () => {
    setCount(prev => {
      const next = prev - step;
      return min !== undefined ? Math.max(next, min) : next;
    });
  };

  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
```
`Math.min` と `Math.max` を使って上限・下限をチェックするのがポイントです。

---

## Exercise 03: useFetch

### レベル1（そっと後押し）
Chapter 07-08 で学んだ `useEffect` と `useState` を組み合わせたフックです。
`data`, `loading`, `error` の3つの state を管理します。

テストを見ると:
- 初期状態: `loading: true`, `data: null`, `error: null`
- 成功時: `loading: false`, `data: レスポンスデータ`, `error: null`
- 失敗時: `loading: false`, `data: null`, `error: エラーメッセージ`
- URL が変わったら再取得

### レベル2（もう少し具体的に）
```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. loading を true にリセット
    // 2. fetch(url) を呼ぶ
    // 3. response.ok をチェック → ダメなら throw
    // 4. response.json() でデータ取得 → setData
    // 5. catch でエラーメッセージを setError
    // 6. finally で setLoading(false)
  }, [url]);  // url が変わったら再実行

  return { data, loading, error };
}
```

### レベル3（ほぼ答え）
```tsx
export function useFetch<T>(url: string): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```
`useEffect` と `useState` を `import { useState, useEffect } from 'react'` でインポートしましょう。
テストでは `fetch` がモックされているので、実際のAPIは呼ばれません。
