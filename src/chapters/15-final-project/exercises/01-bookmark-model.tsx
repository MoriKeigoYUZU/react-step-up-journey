type Bookmark = {
  id: number;
  title: string;
  url: string;
  favorite: boolean;
};

type UseBookmarksReturn = {
  bookmarks: Bookmark[];
  addBookmark: (title: string, url: string) => void;
  removeBookmark: (id: number) => void;
  toggleFavorite: (id: number) => void;
};

// TODO: ブックマーク管理のカスタムフック
// 要件:
//   - useReducer で状態管理
//   - addBookmark: title, url を受け取り追加（favorite は false）
//   - removeBookmark: id で削除
//   - toggleFavorite: id で favorite を切り替え
//
// ヒント: Chapter 12 の useReducer パターンを応用しよう
export function useBookmarks(): UseBookmarksReturn {
  return {
    bookmarks: [],
    addBookmark: () => {},
    removeBookmark: () => {},
    toggleFavorite: () => {},
  };
}
