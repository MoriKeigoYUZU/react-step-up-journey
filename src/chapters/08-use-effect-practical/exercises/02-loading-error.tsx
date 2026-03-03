type Post = {
  id: number;
  title: string;
  body: string;
};

type PostDetailProps = {
  postId: number;
  fetchPost: (id: number) => Promise<Post>;
};

// TODO: 投稿の詳細を取得して表示するコンポーネント
// 要件:
//   - マウント時に fetchPost(postId) を呼ぶ
//   - 読み込み中は「読み込み中...」を表示
//   - 成功時はタイトル(h2)と本文(p)を表示
//   - 失敗時は「エラーが発生しました」を表示
//   - postId が変わったら再取得する
//
// ヒント: loading と error の2つの状態が必要
// ヒント: useEffect の依存配列に postId を入れる
export function PostDetail(_props: PostDetailProps) {
  return null;
}
