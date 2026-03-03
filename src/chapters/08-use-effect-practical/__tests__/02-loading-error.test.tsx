import { render, screen } from '@testing-library/react';
import { PostDetail } from '../exercises/02-loading-error';

describe('PostDetail コンポーネント', () => {
  it('マウント時に「読み込み中...」と表示する', () => {
    const fetchPost = vi.fn().mockReturnValue(new Promise(() => {}));
    render(<PostDetail postId={1} fetchPost={fetchPost} />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('成功時にタイトルと本文を表示する', async () => {
    const fetchPost = vi.fn().mockResolvedValue({
      id: 1,
      title: 'テスト記事',
      body: 'テスト本文です',
    });
    render(<PostDetail postId={1} fetchPost={fetchPost} />);
    expect(await screen.findByText('テスト記事')).toBeInTheDocument();
    expect(screen.getByText('テスト本文です')).toBeInTheDocument();
  });

  it('失敗時に「エラーが発生しました」と表示する', async () => {
    const fetchPost = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<PostDetail postId={1} fetchPost={fetchPost} />);
    expect(await screen.findByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('postId が変わるとデータを再取得する', async () => {
    const fetchPost = vi.fn()
      .mockResolvedValueOnce({ id: 1, title: '記事1', body: '本文1' })
      .mockResolvedValueOnce({ id: 2, title: '記事2', body: '本文2' });

    const { rerender } = render(<PostDetail postId={1} fetchPost={fetchPost} />);
    expect(await screen.findByText('記事1')).toBeInTheDocument();

    rerender(<PostDetail postId={2} fetchPost={fetchPost} />);
    expect(await screen.findByText('記事2')).toBeInTheDocument();
    expect(fetchPost).toHaveBeenCalledTimes(2);
  });
});
