import { renderHook, act } from '@testing-library/react';
import { useBookmarks } from '../exercises/01-bookmark-model';

describe('useBookmarks フック', () => {
  it('初期状態でブックマークが空', () => {
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks).toEqual([]);
  });

  it('addBookmark でブックマークを追加できる', () => {
    const { result } = renderHook(() => useBookmarks());
    act(() => result.current.addBookmark('React公式', 'https://react.dev'));
    expect(result.current.bookmarks).toHaveLength(1);
    expect(result.current.bookmarks[0].title).toBe('React公式');
    expect(result.current.bookmarks[0].url).toBe('https://react.dev');
    expect(result.current.bookmarks[0].favorite).toBe(false);
  });

  it('removeBookmark でブックマークを削除できる', () => {
    const { result } = renderHook(() => useBookmarks());
    act(() => result.current.addBookmark('React公式', 'https://react.dev'));
    const id = result.current.bookmarks[0].id;
    act(() => result.current.removeBookmark(id));
    expect(result.current.bookmarks).toHaveLength(0);
  });

  it('toggleFavorite でお気に入り状態を切り替えられる', () => {
    const { result } = renderHook(() => useBookmarks());
    act(() => result.current.addBookmark('React公式', 'https://react.dev'));
    const id = result.current.bookmarks[0].id;
    act(() => result.current.toggleFavorite(id));
    expect(result.current.bookmarks[0].favorite).toBe(true);
    act(() => result.current.toggleFavorite(id));
    expect(result.current.bookmarks[0].favorite).toBe(false);
  });

  it('複数のブックマークを管理できる', () => {
    const { result } = renderHook(() => useBookmarks());
    act(() => {
      result.current.addBookmark('React公式', 'https://react.dev');
      result.current.addBookmark('MDN', 'https://developer.mozilla.org');
    });
    expect(result.current.bookmarks).toHaveLength(2);
  });
});
