import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../exercises/02-array-state';

describe('TaskList コンポーネント', () => {
  it('初期状態ではリストが空', () => {
    render(<TaskList />);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('テキスト入力して「追加」ボタンでアイテムが追加される', async () => {
    const user = userEvent.setup();
    render(<TaskList />);
    await user.type(screen.getByRole('textbox'), '買い物');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(screen.getByText('買い物')).toBeInTheDocument();
  });

  it('追加後に入力欄がクリアされる', async () => {
    const user = userEvent.setup();
    render(<TaskList />);
    const input = screen.getByRole('textbox');
    await user.type(input, '買い物');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(input).toHaveValue('');
  });

  it('「削除」ボタンで対応するアイテムが削除される', async () => {
    const user = userEvent.setup();
    render(<TaskList />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'タスク1');
    await user.click(screen.getByRole('button', { name: '追加' }));
    await user.type(input, 'タスク2');
    await user.click(screen.getByRole('button', { name: '追加' }));

    const deleteButtons = screen.getAllByRole('button', { name: '削除' });
    await user.click(deleteButtons[0]);

    expect(screen.queryByText('タスク1')).not.toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
  });
});
