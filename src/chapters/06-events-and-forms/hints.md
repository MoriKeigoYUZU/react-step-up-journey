# Chapter 06: イベント処理とフォーム - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: イベントハンドラ

### レベル1（そっと後押し）
2つのボタンがあり、どちらをクリックしても「クリック回数」が増えます。
さらに「最後にクリックしたボタンの名前」も表示します。
2つの state が必要そうですね。
ボタンに引数を渡す方法を考えてみてください。

### レベル2（もう少し具体的に）
- `useState(0)` でクリック回数を管理
- `useState('')` で最後にクリックしたボタン名を管理
- `handleClick` という関数を作り、ボタン名を引数として受け取る
- onClick では `() => handleClick('ボタンA')` のようにアロー関数で包む
- テストでは初期状態で「最後のクリック:」部分は「クリック回数: 0」のテストしかない

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function ClickTracker() {
  const [count, setCount] = useState(0);
  const [lastClicked, setLastClicked] = useState('');

  const handleClick = (buttonName: string) => {
    setCount(prev => prev + 1);
    setLastClicked(buttonName);
  };

  return (
    <div>
      <p>クリック回数: {count}</p>
      <p>最後のクリック: {lastClicked}</p>
      <button onClick={() => handleClick('ボタンA')}>ボタンA</button>
      <button onClick={() => handleClick('ボタンB')}>ボタンB</button>
    </div>
  );
}
```

---

## Exercise 02: 制御フォーム

### レベル1（そっと後押し）
`<label>` と `<input>` を紐付ける方法を思い出してください。
テストでは `screen.getByLabelText('メールアドレス')` で要素を探しています。
フォーム送信時に `e.preventDefault()` を忘れないでください。

### レベル2（もう少し具体的に）
- 2つの state: `email` と `password`
- 各 input に `value` と `onChange` を設定（制御コンポーネント）
- `<label htmlFor="email">メールアドレス</label>` + `<input id="email" />` で紐付け
- `form` の `onSubmit` で:
  1. `e.preventDefault()` を呼ぶ
  2. `props.onSubmit({ email, password })` を呼ぶ
  3. state をリセット（空文字に戻す）

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">メールアドレス</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">パスワード</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">送信</button>
    </form>
  );
}
```

---

## Exercise 03: 複数フィールドフォーム

### レベル1（そっと後押し）
3つの入力欄（名前、メール、自己紹介）と、リアルタイムプレビューを作ります。
自己紹介は `<textarea>` を使います。
プレビュー部分には `data-testid="preview"` をつけましょう。

### レベル2（もう少し具体的に）
- 3つの state を作るか、1つのオブジェクト state にまとめるか選ぶ
- 各入力欄に `<label>` をつける（`htmlFor` + `id` で紐付け）
- `div` に `data-testid="preview"` を設定
- プレビューには `名前: {name}`、`メール: {email}`、`自己紹介: {bio}` を表示
- テストでは `toHaveTextContent` で各項目が含まれることを確認

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';

export function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  return (
    <div>
      <div>
        <label htmlFor="name">名前</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="bio">自己紹介</label>
        <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div data-testid="preview">
        <p>名前: {name}</p>
        <p>メール: {email}</p>
        <p>自己紹介: {bio}</p>
      </div>
    </div>
  );
}
```
