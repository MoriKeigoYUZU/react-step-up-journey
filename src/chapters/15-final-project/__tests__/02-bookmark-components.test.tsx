import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookmarkForm, BookmarkCard, BookmarkFilter } from '../exercises/02-bookmark-components';

describe('BookmarkForm コンポーネント', () => {
  it('タイトルとURLの入力欄がある', () => {
    render(<BookmarkForm onAdd={() => {}} />);
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
  });

  it('入力して追加ボタンで onAdd が呼ばれる', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    render(<BookmarkForm onAdd={handleAdd} />);
    await user.type(screen.getByLabelText('タイトル'), 'React');
    await user.type(screen.getByLabelText('URL'), 'https://react.dev');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(handleAdd).toHaveBeenCalledWith('React', 'https://react.dev');
  });

  it('空欄では追加ボタンが無効', () => {
    render(<BookmarkForm onAdd={() => {}} />);
    expect(screen.getByRole('button', { name: '追加' })).toBeDisabled();
  });

  it('追加後に入力欄がクリアされる', async () => {
    const user = userEvent.setup();
    render(<BookmarkForm onAdd={() => {}} />);
    await user.type(screen.getByLabelText('タイトル'), 'React');
    await user.type(screen.getByLabelText('URL'), 'https://react.dev');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(screen.getByLabelText('タイトル')).toHaveValue('');
    expect(screen.getByLabelText('URL')).toHaveValue('');
  });
});

describe('BookmarkCard コンポーネント', () => {
  it('タイトルとURLを表示する', () => {
    render(
      <BookmarkCard
        title="React"
        url="https://react.dev"
        favorite={false}
        onToggleFavorite={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('https://react.dev')).toBeInTheDocument();
  });

  it('お気に入りボタンで onToggleFavorite が呼ばれる', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <BookmarkCard
        title="React"
        url="https://react.dev"
        favorite={false}
        onToggleFavorite={handleToggle}
        onDelete={() => {}}
      />
    );
    await user.click(screen.getByRole('button', { name: /お気に入り/ }));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('favorite=true のとき「★」が表示される', () => {
    render(
      <BookmarkCard
        title="React"
        url="https://react.dev"
        favorite={true}
        onToggleFavorite={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /お気に入り/ })).toHaveTextContent('★');
  });

  it('favorite=false のとき「☆」が表示される', () => {
    render(
      <BookmarkCard
        title="React"
        url="https://react.dev"
        favorite={false}
        onToggleFavorite={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /お気に入り/ })).toHaveTextContent('☆');
  });

  it('削除ボタンで onDelete が呼ばれる', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(
      <BookmarkCard
        title="React"
        url="https://react.dev"
        favorite={false}
        onToggleFavorite={() => {}}
        onDelete={handleDelete}
      />
    );
    await user.click(screen.getByRole('button', { name: '削除' }));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});

describe('BookmarkFilter コンポーネント', () => {
  it('「すべて」と「お気に入り」のボタンがある', () => {
    render(<BookmarkFilter filter="all" onFilterChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'お気に入り' })).toBeInTheDocument();
  });

  it('「お気に入り」ボタンで onFilterChange("favorites") が呼ばれる', async () => {
    const user = userEvent.setup();
    const handleFilter = vi.fn();
    render(<BookmarkFilter filter="all" onFilterChange={handleFilter} />);
    await user.click(screen.getByRole('button', { name: 'お気に入り' }));
    expect(handleFilter).toHaveBeenCalledWith('favorites');
  });

  it('「すべて」ボタンで onFilterChange("all") が呼ばれる', async () => {
    const user = userEvent.setup();
    const handleFilter = vi.fn();
    render(<BookmarkFilter filter="favorites" onFilterChange={handleFilter} />);
    await user.click(screen.getByRole('button', { name: 'すべて' }));
    expect(handleFilter).toHaveBeenCalledWith('all');
  });
});
