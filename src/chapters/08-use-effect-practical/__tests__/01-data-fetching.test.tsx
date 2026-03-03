import { render, screen } from '@testing-library/react';
import { UserList } from '../exercises/01-data-fetching';

describe('UserList コンポーネント', () => {
  it('マウント時に「読み込み中...」と表示する', () => {
    const fetchUsers = vi.fn().mockReturnValue(new Promise(() => {}));
    render(<UserList fetchUsers={fetchUsers} />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('データ取得後にユーザー名を表示する', async () => {
    const fetchUsers = vi.fn().mockResolvedValue([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
    render(<UserList fetchUsers={fetchUsers} />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('データ取得後に「読み込み中...」が消える', async () => {
    const fetchUsers = vi.fn().mockResolvedValue([
      { id: 1, name: 'Alice' },
    ]);
    render(<UserList fetchUsers={fetchUsers} />);
    await screen.findByText('Alice');
    expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
  });

  it('fetchUsers がマウント時に1回呼ばれる', () => {
    const fetchUsers = vi.fn().mockResolvedValue([]);
    render(<UserList fetchUsers={fetchUsers} />);
    expect(fetchUsers).toHaveBeenCalledTimes(1);
  });
});
