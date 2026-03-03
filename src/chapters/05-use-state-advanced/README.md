# Chapter 05: useStateの応用

## イミュータビリティ（不変性）

Chapter 04 では `useState` の基本を学びました。
数値や文字列の state は比較的シンプルでしたが、**オブジェクトや配列** を state にするときは、重要なルールがあります。

それが **イミュータビリティ（不変性）** です。

### 「写真を差し替える」イメージ

冷蔵庫に貼ってある家族写真を想像してください。

**やってはいけないこと（ミュータブル = 変更可能）:**
写真の上から直接ペンで落書きする。
→ 元の写真が台無しになる。変更前の状態がわからなくなる。

**やるべきこと（イミュータブル = 不変）:**
新しい写真を撮り直して、古い写真と差し替える。
→ 元の写真はそのまま。React は「新しい写真だ！」と気づいて画面を更新する。

```tsx
// NG: 直接変更（React が変化に気づけない！）
const [user, setUser] = useState({ name: '太郎', age: 20 });

function handleClick() {
  user.name = '次郎';  // 同じオブジェクトを書き換えている
  setUser(user);       // React「同じオブジェクトだから変わってないでしょ」
}

// OK: 新しいオブジェクトを作って差し替える
function handleClick() {
  setUser({ ...user, name: '次郎' });  // 新しいオブジェクトを作成
  // React「おっ、新しいオブジェクトだ！画面を更新しよう」
}
```

### なぜ React は気づけないのか？

JavaScript では、オブジェクトを変数に入れると **参照（住所）** が保存されます。

```
user → 住所: 0x1234 → { name: '太郎', age: 20 }
```

`user.name = '次郎'` としても、住所（0x1234）は変わりません。
中身だけが変わっています。

React は **住所が同じかどうか** で「変わったか？」を判断します。
住所が同じなら「変わってない」と判断して、画面を更新しません。

新しいオブジェクト `{ ...user, name: '次郎' }` を作ると、**新しい住所** になります。
React は「住所が違う = 変わった！」と気づいて画面を更新します。

---

## スプレッド構文でオブジェクトを更新する

オブジェクトの state を更新するときは **スプレッド構文** `{...obj}` を使います。

```tsx
const [profile, setProfile] = useState({
  name: '太郎',
  age: 20,
  city: '東京',
});

// 名前だけ変えたい
setProfile({
  ...profile,    // 既存のプロパティをすべてコピー
  name: '次郎',  // name だけ上書き
});

// 結果: { name: '次郎', age: 20, city: '東京' }
```

`...profile` は「profile の中身を全部ここに展開して」という意味です。
その後に `name: '次郎'` を書くことで、name だけが上書きされます。

---

## スプレッド構文で配列を更新する

配列の場合も同じ考え方です。**新しい配列を作って差し替え** ます。

### 追加（push の代わり）

```tsx
const [items, setItems] = useState(['A', 'B']);

// NG: push は元の配列を変更する
items.push('C');
setItems(items);

// OK: スプレッド構文で新しい配列を作る
setItems([...items, 'C']);
// 結果: ['A', 'B', 'C']
```

### 削除（splice の代わり）

```tsx
const [items, setItems] = useState(['A', 'B', 'C']);

// NG: splice は元の配列を変更する
items.splice(1, 1);
setItems(items);

// OK: filter で新しい配列を作る
setItems(items.filter((item) => item !== 'B'));
// 結果: ['A', 'C']
```

### 更新（直接代入の代わり）

```tsx
const [items, setItems] = useState([1, 2, 3]);

// NG: 直接代入
items[1] = 20;
setItems(items);

// OK: map で新しい配列を作る
setItems(items.map((item, i) => (i === 1 ? 20 : item)));
// 結果: [1, 20, 3]
```

### まとめ: 使ってはいけないメソッドと代替

| やりたいこと | NG（元の配列を変更） | OK（新しい配列を作る） |
|---|---|---|
| 追加 | `push`, `unshift` | `[...arr, item]` |
| 削除 | `splice`, `pop`, `shift` | `filter` |
| 更新 | `arr[i] = value` | `map` |
| 並べ替え | `sort`, `reverse` | `[...arr].sort()` |

---

## 関数型更新: setState(prev => ...)

### 「銀行の口座」で考えてみよう

銀行口座に 1000 円入っているとします。

**問題のある方法:**
「口座残高を 1010 円にして」→ 同時に別の取引があったら？

**安全な方法:**
「現在の残高に 10 円足して」→ 現在がいくらであっても正しく動く

```tsx
// 問題のある方法（値を直接指定）
setCount(count + 1);

// 安全な方法（現在の値をもとに計算）
setCount(prev => prev + 1);
```

### なぜ関数型更新が必要なのか

React は **パフォーマンスのため** に、複数の `setState` 呼び出しを **まとめて処理（バッチ処理）** することがあります。

```tsx
function handleClick() {
  setCount(count + 1);  // count は 0 → 0 + 1 = 1
  setCount(count + 1);  // count はまだ 0 → 0 + 1 = 1
  setCount(count + 1);  // count はまだ 0 → 0 + 1 = 1
  // 結果: 1（3 ではない！）
}
```

なぜ？ このレンダリングでの `count` は `0` で固定されているからです（スナップショット！）。
3回とも `0 + 1 = 1` を計算しています。

```tsx
function handleClick() {
  setCount(prev => prev + 1);  // prev = 0 → 1
  setCount(prev => prev + 1);  // prev = 1 → 2
  setCount(prev => prev + 1);  // prev = 2 → 3
  // 結果: 3（正しい！）
}
```

関数型更新では、React が **前の更新結果** を `prev` として渡してくれます。
だから、3回呼べばちゃんと3増えます。

### いつ関数型更新を使うべきか

- **前の値に基づいて更新するとき** → 関数型更新を使う
- **新しい値を直接設定するとき** → 値をそのまま渡す

```tsx
// 前の値に基づく → 関数型更新
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);

// 新しい値を直接設定 → 値を渡す
setCount(0);  // リセット
setName('太郎');  // 特定の値に設定
```

---

## よくある間違い

### 間違い1: push を使ってしまう

```tsx
// NG
const handleAdd = () => {
  items.push(newItem);    // 元の配列を変更
  setItems(items);        // React が変化に気づけない
};

// OK
const handleAdd = () => {
  setItems([...items, newItem]);  // 新しい配列を作る
};
```

### 間違い2: オブジェクトのプロパティを直接変更

```tsx
// NG
const handleChange = () => {
  user.name = '次郎';     // 元のオブジェクトを変更
  setUser(user);          // React が変化に気づけない
};

// OK
const handleChange = () => {
  setUser({ ...user, name: '次郎' });  // 新しいオブジェクトを作る
};
```

### 間違い3: 配列のソートで元を変更

```tsx
// NG
const handleSort = () => {
  items.sort();           // 元の配列を変更！
  setItems(items);
};

// OK
const handleSort = () => {
  setItems([...items].sort());  // コピーしてからソート
};
```

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | オブジェクトの state | スプレッド構文でオブジェクトを更新 |
| 02 | 配列の state | 配列の追加と削除（イミュータブルに） |
| 03 | 関数型更新 | prev => ... を使った安全な更新 |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/05-use-state-advanced
```

---

## まとめ

- **イミュータビリティ**: state のオブジェクト/配列は **直接変更しない**（写真を差し替える）
- **スプレッド構文**: `{...obj}` や `[...arr]` で新しいコピーを作る
- **関数型更新**: `setState(prev => ...)` で前の値に基づいて安全に更新
- **バッチ処理**: React は複数の setState をまとめて処理する
- push, splice, sort などの **破壊的メソッド** は使わない
