import { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  user: { name: string; role: string } | null;
  login: () => void;
  logout: () => void;
};

// TODO: ユーザー情報の Context を作る
const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

// TODO: UserProvider で state と login/logout を管理する
// 要件:
//   - useState で user を管理
//   - login で { name: '太郎', role: 'user' } をセット
//   - logout で null をセット
//   - Context.Provider で children に渡す
export function UserProvider(_props: { children: ReactNode }) {
  void UserContext;
  void useState;
  return null;
}

// TODO: UserStatus でユーザー情報を表示する
// 要件:
//   - user が null なら「ゲスト」と「ログイン」ボタンを表示
//   - user がいれば名前と「ログアウト」ボタンを表示
export function UserStatus() {
  void useContext;
  return null;
}
