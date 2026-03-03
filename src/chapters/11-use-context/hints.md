# Chapter 11: useContext - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: テーマ Context

### レベル1（そっと後押し）
3つのステップを思い出してください:
1. `createContext` でチャンネルを作る（もう作ってあります）
2. `ThemeProvider` の中で `<ThemeContext.Provider value={...}>` を使って放送する
3. `ThemedButton` の中で `useContext(ThemeContext)` で受信する

### レベル2（もう少し具体的に）
- `ThemeProvider`: `props.theme` を `<ThemeContext.Provider value={props.theme}>` に渡して、`props.children` を囲む
- `ThemedButton`: `useContext(ThemeContext)` でテーマを受け取り、`className` を `btn-${theme}` のように設定する
- テストでは Provider なしの場合もテストしている → `createContext('light')` のデフォルト値が使われる

### レベル3（ほぼ答え）
```tsx
export function ThemeProvider(props: { theme: 'light' | 'dark'; children: ReactNode }) {
  return (
    <ThemeContext.Provider value={/* props から何を渡す？ */}>
      {/* children をここに */}
    </ThemeContext.Provider>
  );
}

export function ThemedButton() {
  const theme = useContext(/* 何の Context？ */);
  return (
    <button className={`btn-${theme}`}>テーマボタン</button>
  );
}
```
Provider は `value` に props の theme を渡し、children を囲みます。
ThemedButton は `useContext(ThemeContext)` でテーマを読み取ります。

---

## Exercise 02: ユーザー Context

### レベル1（そっと後押し）
今回は Context に **値と関数** の両方を入れます。
Chapter 04-05 で学んだ `useState` を使って、ユーザー情報を管理する Provider を作りましょう。
`UserStatus` では `useContext` で Context の値を取り出して、条件分岐で表示を切り替えます。

### レベル2（もう少し具体的に）
- `UserProvider`: `useState` で `user` を管理する。`login` は `setUser({ name: '太郎', role: 'user' })` を呼ぶ。`logout` は `setUser(null)` を呼ぶ。これらを `value` として Provider に渡す
- `UserStatus`: `useContext(UserContext)` で `{ user, login, logout }` を取得。`user` が `null` なら「ゲスト」と「ログイン」ボタン、`user` がいれば `user.name` と「ログアウト」ボタンを表示

### レベル3（ほぼ答え）
```tsx
export function UserProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  const login = () => setUser({ name: '太郎', role: 'user' });
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {props.children}
    </UserContext.Provider>
  );
}

export function UserStatus() {
  const { user, login, logout } = useContext(UserContext);

  if (user === null) {
    return (
      <div>
        <p>ゲスト</p>
        <button onClick={login}>ログイン</button>
      </div>
    );
  }

  return (
    <div>
      <p>{user.name}</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}
```
このレベルまで来たら、コードを写すのではなく、まず自分で書いてみて、
詰まった箇所だけ確認するようにしましょう。
