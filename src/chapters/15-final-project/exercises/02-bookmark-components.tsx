// TODO: ブックマーク追加フォーム
// 要件:
//   - 「タイトル」ラベル + input
//   - 「URL」ラベル + input
//   - 「追加」ボタン（空欄なら disabled）
//   - 追加後にフォームクリア
export function BookmarkForm(_props: { onAdd: (title: string, url: string) => void }) {
  return null;
}

// TODO: ブックマークカード
// 要件:
//   - タイトルとURLを表示
//   - お気に入りボタン（★ / ☆ の切り替え、aria-label に「お気に入り」を含む）
//   - 削除ボタン
export function BookmarkCard(_props: {
  title: string;
  url: string;
  favorite: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  return null;
}

// TODO: フィルター切り替え
// 要件:
//   - 「すべて」ボタン → onFilterChange('all')
//   - 「お気に入り」ボタン → onFilterChange('favorites')
export function BookmarkFilter(_props: {
  filter: 'all' | 'favorites';
  onFilterChange: (filter: 'all' | 'favorites') => void;
}) {
  return null;
}
