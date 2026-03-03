# Chapter 14: レンダリング最適化 - 無駄な再描画を防ぐ

## なぜ再レンダーが起きるのか？

React では、コンポーネントの **state が変わる** と、そのコンポーネントが **再レンダー** されます。
そして、ここが大事なポイントですが:

> **親コンポーネントが再レンダーされると、すべての子コンポーネントも再レンダーされる**

### アナロジー: 部署ミーティング

会社で部長が「全体ミーティング」を招集すると、部署全員が集まります。
たとえ、議題が特定のチームにしか関係なくても、**全員** が参加しなければなりません。

```
部長（親コンポーネント）: 「ミーティング！」
  ├─ Aチーム: 「自分たちに関係あるから参加」
  ├─ Bチーム: 「関係ないけど...参加」  ← 無駄！
  └─ Cチーム: 「関係ないけど...参加」  ← 無駄！
```

React のデフォルト動作もこれと同じです。
親が再レンダーされたら、props が変わっていなくても、子も全部再レンダーされます。

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>

      {/* count と関係ないのに、毎回再レンダーされる */}
      <ExpensiveChild name="固定の値" />
    </div>
  );
}
```

---

## React.memo: 「変更がなければ参加しなくていいよ」

`React.memo` は、コンポーネントを **メモ化** します。
前回と同じ props なら再レンダーをスキップします。

### アナロジー: 前回と同じ議題なら欠席OK

```
部長: 「ミーティング！」
  ├─ Aチーム: 「議題が変わった → 参加」
  ├─ Bチーム（memo付き）: 「前回と議題同じだな → 不参加」  ← スキップ！
  └─ Cチーム（memo付き）: 「前回と議題同じだな → 不参加」  ← スキップ！
```

### 使い方

```tsx
import { memo } from 'react';

// 普通のコンポーネント（memo なし）
function ExpensiveChild({ name }: { name: string }) {
  console.log('ExpensiveChild レンダー');  // 親が更新されるたび呼ばれる
  return <p>名前: {name}</p>;
}

// memo でラップ（props が同じなら再レンダーをスキップ）
const MemoizedChild = memo(ExpensiveChild);
// → name が変わったときだけ再レンダーされる
```

### props の比較方法: 浅い比較（Shallow Comparison）

`React.memo` は props を **浅い比較**（shallow comparison）でチェックします。

```tsx
// プリミティブ値（文字列、数値など）: 値で比較
"hello" === "hello"  // true → 再レンダーしない
42 === 42            // true → 再レンダーしない

// オブジェクトや配列: 参照（メモリアドレス）で比較
{ name: "太郎" } === { name: "太郎" }  // false → 再レンダーする！
[1, 2, 3] === [1, 2, 3]                // false → 再レンダーする！
```

**ここが罠です**: オブジェクトや配列は、中身が同じでも **新しく作るたびに別物** とみなされます。

---

## useMemo: 「高い計算の結果を覚えておく」

`useMemo` は、計算結果を **メモ化**（キャッシュ）します。
依存する値が変わらない限り、前回の計算結果を再利用します。

### アナロジー: 付箋メモ

毎回税込価格を計算するのは面倒ですよね。
一度計算したら **付箋（メモ）** に書いておいて、同じ質問がきたら付箋を見せればいい。
所得が変わったら、はじめて再計算する。

```tsx
import { useMemo } from 'react';

function PriceList({ items }: { items: number[] }) {
  // items が変わらない限り、前回の結果を再利用
  const total = useMemo(() => {
    console.log('合計を計算中...');  // items が変わったときだけ表示
    return items.reduce((sum, item) => sum + item, 0);
  }, [items]);  // items が変わったら再計算

  return <p>合計: {total}</p>;
}
```

### いつ useMemo を使うべきか？

- **重い計算**: 大量のデータのフィルタリング、ソート、集計
- **参照の安定化**: `React.memo` に渡すオブジェクトや配列を安定させたいとき

```tsx
// ❌ 不要: 単純な計算
const doubled = useMemo(() => count * 2, [count]);  // useMemo の必要なし

// ✅ 有用: 重い計算
const filteredItems = useMemo(
  () => items.filter(item => item.price > threshold).sort((a, b) => a.price - b.price),
  [items, threshold]
);
```

---

## useCallback: 「同じ関数の参照を保つ」

`useCallback` は、**関数のメモ化** です。
依存する値が変わらない限り、同じ関数の参照を返します。

### なぜ関数の参照が重要なのか？

React コンポーネントが再レンダーされるとき、関数は **毎回新しく作られます**。

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // 毎回新しい関数が作られる！
  const handleClick = () => {
    console.log('クリック');
  };

  // memo で囲んでも、handleClick が毎回新しいので再レンダーされてしまう
  return <MemoizedChild onClick={handleClick} />;
}
```

`React.memo` は props が変わったかを **参照で比較** します。
関数が毎回新しく作られると、`memo` は「props が変わった！」と判断してしまいます。

```tsx
// 毎回新しい関数 → memo が効かない
const fn1 = () => console.log('hello');
const fn2 = () => console.log('hello');
fn1 === fn2  // false！ 中身は同じだけど、別の関数

// useCallback で同じ参照を保つ
const fn = useCallback(() => {
  console.log('hello');
}, []);  // 依存配列が変わらない限り、同じ fn
```

### アナロジー: 名刺

会議のたびに新しい名刺を作り直していたら、相手は「この人、前と同じ人？」と混乱しますよね。
`useCallback` は「同じ名刺を使い続ける」ことで、相手（React.memo）に
「前と同じ人ですよ」と伝えるようなものです。

### 使い方

```tsx
import { useCallback, memo, useState } from 'react';

const Child = memo(function Child({ onClick }: { onClick: () => void }) {
  console.log('Child レンダー');
  return <button onClick={onClick}>クリック</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // useCallback で関数の参照を安定させる
  const handleClick = useCallback(() => {
    console.log('クリック');
  }, []);  // 依存配列が空 → 常に同じ関数

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      {/* handleClick の参照が安定しているので、Child は再レンダーされない */}
      <Child onClick={handleClick} />
    </div>
  );
}
```

---

## 大事な注意: 最適化は「必要なとき」だけ！

> **「早すぎる最適化は諸悪の根源である」** - ドナルド・クヌース

### 最適化しなくていい場合がほとんど

React の再レンダーは、ほとんどの場合 **十分に高速** です。
`React.memo`、`useMemo`、`useCallback` を使うこと自体にもコストがあります。

```
最適化のコスト:
  - メモリ使用量の増加（前回の値を保持するため）
  - コードの複雑さの増加
  - 比較処理のオーバーヘッド
```

### 最適化すべきケース

以下のような場合にのみ、最適化を検討しましょう:

1. **大きなリスト** が頻繁に再レンダーされる
2. **重い計算**（フィルタリング、ソートなど）が毎レンダーで実行される
3. **React DevTools Profiler** で実際にパフォーマンス問題が確認できる

### 最適化の前にすべきこと

1. **まず計測する**: React DevTools の Profiler で遅いコンポーネントを特定する
2. **構造を見直す**: state の配置を変えるだけで解決することも多い
3. **それでもダメなら最適化**: memo, useMemo, useCallback を適用する

---

## レンダー回数の追跡: useRef を使ったデバッグ

コンポーネントが何回レンダーされているか確認するのに `useRef` が便利です。

```tsx
import { useRef } from 'react';

function MyComponent() {
  const renderCount = useRef(0);
  renderCount.current += 1;  // レンダーのたびに +1

  return (
    <div>
      <p data-testid="render-count">{renderCount.current}</p>
      {/* ... */}
    </div>
  );
}
```

**なぜ useState ではなく useRef？**
`useState` で更新すると **また再レンダー** が起きてしまい、無限ループになります。
`useRef` は更新しても再レンダーを引き起こさないので、カウンターとして安全に使えます。

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | React.memo | memo あり/なしの再レンダーの違い |
| 02 | useMemo と useCallback | フィルタリングのメモ化 |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/14-rendering-optimization
```

---

## まとめ

- **親が再レンダー → 子も全部再レンダー**（React のデフォルト動作）
- **React.memo**: props が変わらなければ再レンダーをスキップ
- **useMemo**: 重い計算の結果をキャッシュ
- **useCallback**: 関数の参照を安定させる（memo と組み合わせて使う）
- **浅い比較**: オブジェクトや関数は中身が同じでも新しい参照 = 「変わった」と判定される
- **最適化は必要なときだけ！** まず計測し、構造を見直し、それでもダメなら最適化
- **useRef** でレンダー回数を追跡できる（デバッグ用）
