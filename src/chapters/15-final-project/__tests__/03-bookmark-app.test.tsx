import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookmarkApp } from '../exercises/03-bookmark-app';

describe('BookmarkApp 統合テスト', () => {
  it('ブックマークを追加するとリストに表示される', async () => {
    const user = userEvent.setup();
    render(<BookmarkApp />);
    await user.type(screen.getByLabelText('タイトル'), 'React');
    await user.type(screen.getByLabelText('URL'), 'https://react.dev');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('お気に入りボタンで星が切り替わる', async () => {
    const user = userEvent.setup();
    render(<BookmarkApp />);
    await user.type(screen.getByLabelText('タイトル'), 'React');
    await user.type(screen.getByLabelText('URL'), 'https://react.dev');
    await user.click(screen.getByRole('button', { name: '追加' }));

    const favButton = screen.getByRole('button', { name: /お気に入り/ });
    expect(favButton).toHaveTextContent('☆');
    await user.click(favButton);
    expect(favButton).toHaveTextContent('★');
  });

  it('「お気に入り」フィルタで絞り込みができる', async () => {
    const user = userEvent.setup();
    render(<BookmarkApp />);

    // 2つ追加
    await user.type(screen.getByLabelText('タイトル'), 'React');
    await user.type(screen.getByLabelText('URL'), 'https://react.dev');
    await user.click(screen.getByRole('button', { name: '追加' }));

    await user.type(screen.getByLabelText('タイトル'), 'MDN');
    await user.type(screen.getByLabelText('URL'), 'https://developer.mozilla.org');
    await user.click(screen.getByRole('button', { name: '追加' }));

    // 1つだけお気に入りに
    const favButtons = screen.getAllByRole('button', { name: /お気に入り/ });
    await user.click(favButtons[0]);

    // フィルタ
    await user.click(screen.getByRole('button', { name: 'お気に入り' }));
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('MDN')).not.toBeInTheDocument();
  });

  it('削除ボタンでブックマークが消える', async () => {
    const user = userEvent.setup();
    render(<BookmarkApp />);
    await user.type(screen.getByLabelText('タイトル'), 'React');
    await user.type(screen.getByLabelText('URL'), 'https://react.dev');
    await user.click(screen.getByRole('button', { name: '追加' }));

    await user.click(screen.getByRole('button', { name: '削除' }));
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });
});
