type Todo = {
  id: number;
  title: string;
  done: boolean;
};

// TODO: Todo リストを表示するコンポーネント
// 要件:
//   - 各Todoを li で表示（done のものには className="completed"）
//   - 完了件数を「完了: X/Y」の形式で p タグに表示
// ヒント: .filter() で完了済みの数を数えられる
export function TodoList(_props: { todos: Todo[] }) {
  return null;
}
