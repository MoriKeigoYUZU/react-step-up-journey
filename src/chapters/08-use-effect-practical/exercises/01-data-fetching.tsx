type User = {
  id: number;
  name: string;
};

type UserListProps = {
  fetchUsers: () => Promise<User[]>;
};

// TODO: ユーザー一覧を非同期で取得して表示するコンポーネント
// 要件:
//   - マウント時に fetchUsers() を呼ぶ
//   - 取得中は「読み込み中...」と表示
//   - 取得後はユーザー名をリスト表示
//
// ヒント: loading 状態を useState で管理する
// ヒント: useEffect の中で async 関数を定義して呼ぶ
export function UserList(_props: UserListProps) {
  return null;
}
