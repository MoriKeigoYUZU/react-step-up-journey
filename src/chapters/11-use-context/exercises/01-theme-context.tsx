import { createContext, useContext, ReactNode } from 'react';

// TODO: テーマの Context を作成する
// ヒント: createContext のデフォルト値を 'light' にする
const ThemeContext = createContext<'light' | 'dark'>('light');

// TODO: ThemeProvider コンポーネント
// 要件: theme を受け取り、Context.Provider で children に渡す
export function ThemeProvider(_props: { theme: 'light' | 'dark'; children: ReactNode }) {
  return null;
}

// TODO: テーマに応じたスタイルのボタン
// 要件:
//   - useContext でテーマを読み取る
//   - className を "btn-light" or "btn-dark" にする
//   - テキストは「テーマボタン」
export function ThemedButton() {
  // This line prevents the "unused" error for the imports
  void ThemeContext;
  void useContext;
  return null;
}
