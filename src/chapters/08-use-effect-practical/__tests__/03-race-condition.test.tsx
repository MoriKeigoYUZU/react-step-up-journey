import { render, screen } from '@testing-library/react';
import { SearchResults } from '../exercises/03-race-condition';

describe('SearchResults コンポーネント', () => {
  it('query に応じて検索結果を表示する', async () => {
    const search = vi.fn().mockResolvedValue(['React', 'Redux']);
    render(<SearchResults query="React" search={search} />);
    expect(await screen.findByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
  });

  it('query が空のとき検索しない', () => {
    const search = vi.fn();
    render(<SearchResults query="" search={search} />);
    expect(search).not.toHaveBeenCalled();
  });

  it('古い検索結果が新しい結果を上書きしない（レースコンディション対策）', async () => {
    let resolveFirst: (value: string[]) => void;
    const firstPromise = new Promise<string[]>((resolve) => {
      resolveFirst = resolve;
    });

    const search = vi.fn()
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce(['Next.js', 'Nuxt']);

    const { rerender } = render(<SearchResults query="React" search={search} />);

    // query が変わる（2回目の検索が先に完了する）
    rerender(<SearchResults query="Next" search={search} />);
    expect(await screen.findByText('Next.js')).toBeInTheDocument();

    // 1回目の検索が遅れて完了しても、結果が上書きされない
    resolveFirst!(['React', 'Redux']);
    // Wait a tick to ensure any state updates from the late resolution have processed
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.queryByText('React')).not.toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });
});
