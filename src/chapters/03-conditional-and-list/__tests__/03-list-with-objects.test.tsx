import { render, screen } from '@testing-library/react';
import { TodoList } from '../exercises/03-list-with-objects';

const sampleTodos = [
  { id: 1, title: '買い物', done: true },
  { id: 2, title: '掃除', done: false },
  { id: 3, title: '料理', done: true },
];

describe('TodoList コンポーネント', () => {
  it('各Todoのタイトルが表示される', () => {
    render(<TodoList todos={sampleTodos} />);
    expect(screen.getByText('買い物')).toBeInTheDocument();
    expect(screen.getByText('掃除')).toBeInTheDocument();
    expect(screen.getByText('料理')).toBeInTheDocument();
  });

  it('完了済みのTodoに className="completed" が適用される', () => {
    render(<TodoList todos={sampleTodos} />);
    expect(screen.getByText('買い物').closest('li')).toHaveClass('completed');
    expect(screen.getByText('料理').closest('li')).toHaveClass('completed');
  });

  it('未完了のTodoに className="completed" が適用されない', () => {
    render(<TodoList todos={sampleTodos} />);
    expect(screen.getByText('掃除').closest('li')).not.toHaveClass('completed');
  });

  it('完了件数を「完了: 2/3」の形式で表示する', () => {
    render(<TodoList todos={sampleTodos} />);
    expect(screen.getByText('完了: 2/3')).toBeInTheDocument();
  });
});
