type Todo = {
  id: number;
  title: string;
  done: boolean;
};

type TodoState = {
  todos: Todo[];
  nextId: number;
};

type TodoAction =
  | { type: 'ADD'; title: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number };

// TODO: Todo用のReducer関数
// 要件:
//   - ADD: 新しいTodo（id=nextId, done=false）を追加し、nextId を +1
//   - TOGGLE: 指定 id の done を反転
//   - DELETE: 指定 id のTodoを削除
export function todoReducer(_state: TodoState, _action: TodoAction): TodoState {
  return { todos: [], nextId: 1 };
}

// TODO: useReducer を使った Todo アプリ
// 要件:
//   - テキスト入力 + 「追加」ボタンで Todo を追加
//   - Todo テキストをクリックで完了切り替え（取り消し線）
//   - 各Todoに「削除」ボタン
export function TodoApp() {
  return null;
}
