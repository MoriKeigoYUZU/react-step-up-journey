# Chapter 11: useContext - コンポーネント間でデータを共有する

## Prop Drilling（バケツリレー）問題

React では、親コンポーネントから子コンポーネントへデータを渡すために **props** を使います。
これまでの章で、props の使い方はしっかり学びましたね。

でも、こんな状況を想像してみてください。

```
App（テーマ: "dark"）
  └─ Layout
      └─ Sidebar
          └─ Menu
              └─ MenuItem ← ここで "dark" テーマを使いたい！
```

`App` が持っている「テーマ」の情報を、`MenuItem` で使いたい。
でも、`Layout` → `Sidebar` → `Menu` は テーマを使わない のに、props をリレーのように渡さなければなりません。

```tsx
// こんな風に「バケツリレー」になる
function App() {
  return <Layout theme="dark" />;
}

function Layout({ theme }: { theme: string }) {
  return <Sidebar theme={theme} />;  // 自分は使わないのに渡す
}

function Sidebar({ theme }: { theme: string }) {
  return <Menu theme={theme} />;     // 自分は使わないのに渡す
}

function Menu({ theme }: { theme: string }) {
  return <MenuItem theme={theme} />;  // ようやく使う！
}
```

### アナロジー: 伝言ゲーム

これは **伝言ゲーム** のようなものです。

あなたが教室の一番後ろにいる友達にメッセージを届けたいとします。
間に座っている全員に「これを後ろに回して」とお願いしなければなりません。

- 間の人たちは、メッセージの内容に **興味がない** のに渡さなければならない
- 人数が増えると **面倒** になる
- 途中で **間違い**（props 名の間違い、渡し忘れ）が起きやすい

これが **Prop Drilling**（プロップ・ドリリング）と呼ばれる問題です。
日本語では **「バケツリレー」** と表現されることもあります。

---

## Context: 全員に一斉に届く「放送チャンネル」

React の **Context**（コンテキスト）は、この問題を解決します。

### アナロジー: 校内放送

伝言ゲームの代わりに、**校内放送** を使うことを想像してください。

- 校長先生（Provider）がマイクで放送する
- 教室にいる **全員** が直接聞くことができる
- 中間で誰かがリレーする必要がない
- 聞きたい人だけがスピーカーに耳を傾ける

Context はまさにこの **「放送チャンネル」** です。
データを「放送」すれば、ツリーのどこにいるコンポーネントでも直接受け取れます。

```
App（Provider: テーマ "dark" を放送中 📡）
  └─ Layout（テーマ不要 → スルー）
      └─ Sidebar（テーマ不要 → スルー）
          └─ Menu（テーマ不要 → スルー）
              └─ MenuItem（📻 テーマを受信！→ "dark"）
```

---

## Context を使う3ステップ

Context を使うには、3つのステップがあります。

### ステップ1: Context を作る（`createContext`）

「放送チャンネル」を作ります。

```tsx
import { createContext } from 'react';

// 「テーマ」を放送するチャンネルを作成
const ThemeContext = createContext<'light' | 'dark'>('light');
```

`createContext` の引数は **デフォルト値** です。
Provider で囲まれていないコンポーネントが Context を読もうとしたとき、この値が使われます。

### ステップ2: Provider で「放送」する

「マイクを持って放送する」コンポーネントを配置します。

```tsx
function App() {
  return (
    // value に "dark" を設定 = "dark" を放送中
    <ThemeContext.Provider value="dark">
      <Layout />  {/* この中のどこでもテーマを受信できる */}
    </ThemeContext.Provider>
  );
}
```

`<ThemeContext.Provider value={...}>` で囲まれた **すべての子孫コンポーネント** が、
この Context の値にアクセスできるようになります。

### ステップ3: useContext で「受信」する

どこからでも、`useContext` で値を受け取れます。

```tsx
import { useContext } from 'react';

function MenuItem() {
  // 📻 ThemeContext の放送を受信！
  const theme = useContext(ThemeContext);

  return (
    <li className={`menu-item-${theme}`}>
      メニュー項目
    </li>
  );
}
```

もう、Layout → Sidebar → Menu とバケツリレーする必要はありません！

---

## デフォルト値の役割

`createContext` に渡すデフォルト値は、**Provider なしで useContext を使った場合** に返される値です。

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');

function SomeComponent() {
  // Provider で囲まれていない場合、デフォルト値 'light' が返る
  const theme = useContext(ThemeContext);
  console.log(theme); // 'light'
}
```

これは **フォールバック**（代替手段）として機能します。
「放送局（Provider）が見つからないとき、デフォルトのチャンネルを流す」ようなものです。

---

## 動的な Context: state と組み合わせる

Context の真価は、**useState と組み合わせて動的に値を変えられる** ことです。

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

// Provider コンポーネント
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使う側
function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      現在のテーマ: {theme}
    </button>
  );
}
```

この例では、Context を通じて **値だけでなく、値を変更する関数** も共有しています。
これにより、ツリーのどこからでもテーマを切り替えられます。

---

## Context をいつ使うべきか？

### 使うべきケース

Context は **「多くのコンポーネントで共有される、あまり変わらないデータ」** に向いています。

- **テーマ**（ライト/ダーク）: アプリ全体で参照、変更は少ない
- **ログインユーザー情報**: 多くのコンポーネントで必要、変更は少ない
- **言語設定（ロケール）**: アプリ全体で参照
- **UI の状態**（サイドバーの開閉など）: 関連コンポーネントで共有

### 使うべきでないケース

- **頻繁に変わるデータ**: Context の値が変わると、**そのContextを使っている全コンポーネント** が再レンダーされます。毎秒変わるようなデータには向きません
- **1〜2層のpropリレー**: わざわざContext を作るよりも、素直に props を渡したほうが簡単な場合もあります
- **何でもかんでも Context**: props でシンプルに渡せるものまで Context にすると、コードが複雑になります

### アナロジー: 校内放送 vs 直接話す

- **隣の人に伝える**（1〜2層の props）→ 直接話すほうが早い
- **校内全員に伝える**（多層にまたがる共有データ）→ 校内放送（Context）が便利

---

## Provider のネスト

複数の Context を使う場合、Provider をネスト（入れ子）にできます。

```tsx
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LocaleProvider>
          <MainApp />
        </LocaleProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```

各 Context は独立しているので、テーマだけを使うコンポーネント、ユーザー情報だけを使うコンポーネント、
と必要なものだけを `useContext` で取得できます。

---

## Next.js での活用

Next.js（React のフレームワーク）では、Context はよく使われます。

ただし注意点があります。Next.js の App Router では、Server Component（サーバーコンポーネント）では
`useContext` を使えません。Context を使うには `'use client'` ディレクティブをつけた
Client Component にする必要があります。

```tsx
'use client';  // Next.js の Client Component

import { useContext } from 'react';
import { ThemeContext } from './theme-context';

export function ThemeButton() {
  const theme = useContext(ThemeContext);
  // ...
}
```

今はこれを覚える必要はありませんが、「Context = クライアントサイドの機能」という点だけ
頭の片隅に入れておくと、Next.js を学ぶときに役立ちます。

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | テーマ Context | createContext, Provider, useContext の基本 |
| 02 | ユーザー Context | Context + useState で動的なデータ管理 |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/11-use-context
```

---

## まとめ

- **Prop Drilling** はバケツリレーのように、中間コンポーネントが使わない props を渡す問題
- **Context** は「放送チャンネル」。Provider で放送し、useContext で受信する
- 3ステップ: `createContext` → `Provider` → `useContext`
- **デフォルト値** は Provider がないときのフォールバック
- Context は **テーマ、ユーザー情報、言語設定** のような「広く共有される、変更が少ないデータ」に適している
- **頻繁に変わるデータ** や **浅い props リレー** には Context を使わないほうがいい
