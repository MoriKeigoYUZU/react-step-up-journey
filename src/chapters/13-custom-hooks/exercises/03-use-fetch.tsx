type UseFetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// TODO: データ取得のカスタムフック
// 要件:
//   - url を受け取り、fetch でデータを取得する
//   - loading: 取得中は true
//   - data: 成功時にレスポンスの JSON
//   - error: 失敗時にエラーメッセージ
//   - url が変わったら再取得する
//
// ヒント: useState で data, loading, error を管理
// ヒント: useEffect で fetch を呼ぶ
export function useFetch<T>(_url: string): UseFetchReturn<T> {
  return { data: null, loading: false, error: null };
}
