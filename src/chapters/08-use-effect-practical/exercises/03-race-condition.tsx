type SearchResultsProps = {
  query: string;
  search: (query: string) => Promise<string[]>;
};

// TODO: 検索結果を表示するコンポーネント（レースコンディション対策あり）
// 要件:
//   - query が変わるたびに search(query) を呼ぶ
//   - query が空のときは検索しない
//   - 結果を ul > li でリスト表示する
//   - 古い検索結果が新しい結果を上書きしない
//
// ヒント: useEffect のクリーンアップで「古い結果を無視する」フラグを使う
//   let ignore = false;
//   return () => { ignore = true; };
export function SearchResults(_props: SearchResultsProps) {
  return null;
}
