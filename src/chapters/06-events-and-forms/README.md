# Chapter 06: イベント処理とフォーム

## Reactのイベント処理

これまでの章で `onClick` を使ってきましたが、ここでイベント処理を体系的に学びましょう。

### HTMLとReactのイベント処理の違い

HTMLでは:
```html
<button onclick="handleClick()">クリック</button>
```

Reactでは:
```tsx
<button onClick={handleClick}>クリック</button>
```

違いは3つ:
1. **camelCase で書く**: `onclick` → `onClick`、`onchange` → `onChange`
2. **文字列ではなく関数を渡す**: `"handleClick()"` → `{handleClick}`
3. **SyntheticEvent**: React が独自のイベントオブジェクトを渡す（ブラウザ間の違いを吸収）

---

## イベントハンドラに引数を渡す

ここで初学者がよく陥る罠があります。

### 間違いパターン: 即座に実行されてしまう

```tsx
// NG: ボタンが表示された瞬間に handleClick が実行される！
<button onClick={handleClick('太郎')}>クリック</button>
```

なぜ？ `handleClick('太郎')` は **関数の呼び出し** です。
JSXが評価されるとき（画面が描画されるとき）に即座に実行されてしまいます。

### 正しいパターン: アロー関数で包む

```tsx
// OK: クリックされたときに handleClick('太郎') が実行される
<button onClick={() => handleClick('太郎')}>クリック</button>
```

`() => handleClick('太郎')` は **関数の定義** です。
「クリックされたら、この関数を実行してね」と React に伝えています。

### 料理で例えるなら

- **NG**: `handleClick('太郎')` = 「今すぐ料理を始めて」（まだお客さん来てないのに！）
- **OK**: `() => handleClick('太郎')` = 「お客さんが来たら料理を始めてね」（予約を入れるだけ）

```tsx
function App() {
  const handleGreet = (name: string) => {
    alert(`こんにちは、${name}さん！`);
  };

  return (
    <div>
      {/* クリックされたとき実行される（正しい） */}
      <button onClick={() => handleGreet('太郎')}>太郎に挨拶</button>
      <button onClick={() => handleGreet('花子')}>花子に挨拶</button>
    </div>
  );
}
```

---

## 制御コンポーネント（Controlled Components）

フォームの入力を React で管理する方法です。

### 「操り人形」のイメージ

通常の `<input>` は **自分で** 値を管理しています。
ユーザーが文字を入力すると、input が勝手に表示を更新します。

制御コンポーネントでは、**React が input の値を支配** します。

```
通常の input:
  ユーザー入力 → input が自分で値を更新 → 表示が変わる

制御コンポーネント:
  ユーザー入力 → React に「変わったよ」と報告（onChange）
              → React が state を更新（setState）
              → React が input に新しい値を渡す（value）
              → 表示が変わる
```

操り人形のように、**糸（state）を通じて React が input を制御** しています。

```tsx
function NameForm() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}                              // state の値を表示
      onChange={(e) => setName(e.target.value)}  // 入力されたら state を更新
    />
  );
}
```

### なぜ制御コンポーネントを使うのか？

**React が「唯一の情報源（Single Source of Truth）」になる** からです。

- フォームの値が常に state と一致する
- バリデーション（入力チェック）が簡単にできる
- 値の加工（例: 全角→半角変換）がリアルタイムでできる
- フォームの状態を他のコンポーネントと共有しやすい

---

## フォーム送信と preventDefault

HTMLの `<form>` は、送信ボタンを押すと **ページを再読み込み** します。
これはReactアプリでは困ります（アプリの状態がリセットされてしまう）。

```tsx
function LoginForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // ページ再読み込みを防ぐ
    // ここでフォームの処理をする
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <button type="submit">送信</button>
    </form>
  );
}
```

### なぜ preventDefault？

ブラウザのデフォルト動作（ページ遷移）を **阻止** するためです。

例えるなら:
- ブラウザ: 「フォーム送信された！サーバーにページ取りに行くぞ！」
- `preventDefault()`: 「ちょっと待って。自分たちで処理するから、勝手に動かないで」

---

## 複数のフォームフィールドの管理

フォームにフィールドが複数あるとき、2つのアプローチがあります。

### アプローチ1: 複数の useState

```tsx
function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
    </form>
  );
}
```

### アプローチ2: オブジェクトの useState

```tsx
function ProfileForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <form>
      <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
      <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
      <textarea value={form.bio} onChange={(e) => handleChange('bio', e.target.value)} />
    </form>
  );
}
```

どちらでも動きますが:
- **フィールドが少ない**: アプローチ1がシンプル
- **フィールドが多い**: アプローチ2が管理しやすい

---

## label と input の紐付け

アクセシビリティのために、`<label>` と `<input>` を紐付けましょう。

```tsx
// 方法1: htmlFor（HTMLの for と同じ）
<label htmlFor="email">メールアドレス</label>
<input id="email" type="email" />

// 方法2: label で input を囲む
<label>
  メールアドレス
  <input type="email" />
</label>
```

テストでは `screen.getByLabelText('メールアドレス')` でアクセスできます。

---

## よくあるイベントの種類

| イベント | 発生タイミング | よくある使い方 |
|---|---|---|
| `onClick` | クリック時 | ボタンの処理 |
| `onChange` | 値が変わった時 | フォーム入力 |
| `onSubmit` | フォーム送信時 | フォーム処理 |
| `onFocus` | フォーカス時 | 入力欄のハイライト |
| `onBlur` | フォーカスが外れた時 | バリデーション |
| `onKeyDown` | キーを押した時 | ショートカットキー |

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | イベントハンドラ | 引数付きイベントハンドラ |
| 02 | 制御フォーム | 制御コンポーネントとフォーム送信 |
| 03 | 複数フィールドフォーム | 複数の入力とリアルタイムプレビュー |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/06-events-and-forms
```

---

## まとめ

- **イベント処理**: camelCase で書く、関数そのものを渡す
- **引数付きイベントハンドラ**: `onClick={() => fn(arg)}` でアロー関数で包む
- **制御コンポーネント**: `value` と `onChange` で React が入力を制御する（操り人形）
- **preventDefault**: ブラウザのデフォルト動作を止めて、自分で処理する
- **label と input**: アクセシビリティのために紐付ける
