import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { todoReducer, TodoApp } from '../exercises/02-todo-reducer';

describe('todoReducer（単体テスト）', () => {
  const initialState = { todos: [], nextId: 1 };

  it('ADD でTodoが追加される', () => {
    const result = todoReducer(initialState, { type: 'ADD', title: 'テスト' });
    expect(result.todos).toHaveLength(1);
    expect(result.todos[0]).toEqual({ id: 1, title: 'テスト', done: false });
    expect(result.nextId).toBe(2);
  });

  it('TOGGLE で done が切り替わる', () => {
    const state = {
      todos: [{ id: 1, title: 'テスト', done: false }],
      nextId: 2,
    };
    const result = todoReducer(state, { type: 'TOGGLE', id: 1 });
    expect(result.todos[0].done).toBe(true);
  });

  it('DELETE でTodoが削除される', () => {
    const state = {
      todos: [
        { id: 1, title: 'テスト1', done: false },
        { id: 2, title: 'テスト2', done: false },
      ],
      nextId: 3,
    };
    const result = todoReducer(state, { type: 'DELETE', id: 1 });
    expect(result.todos).toHaveLength(1);
    expect(result.todos[0].title).toBe('テスト2');
  });
});

describe('TodoApp コンポーネント', () => {
  it('テキスト入力と追加ボタンがある', () => {
    render(<TodoApp />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  it('Todoを追加できる', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    await user.type(screen.getByRole('textbox'), '買い物');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(screen.getByText('買い物')).toBeInTheDocument();
  });

  it('Todoをクリックすると取り消し線が付く', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    await user.type(screen.getByRole('textbox'), '買い物');
    await user.click(screen.getByRole('button', { name: '追加' }));
    await user.click(screen.getByText('買い物'));
    expect(screen.getByText('買い物')).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('削除ボタンでTodoを削除できる', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    await user.type(screen.getByRole('textbox'), '買い物');
    await user.click(screen.getByRole('button', { name: '追加' }));
    await user.click(screen.getByRole('button', { name: '削除' }));
    expect(screen.queryByText('買い物')).not.toBeInTheDocument();
  });
});
