// TODO: document.title を更新するコンポーネント
// 要件:
//   - title props に応じて document.title を設定する
//   - title が変わったら document.title も更新する
//   - アンマウント時に document.title を '' に戻す（クリーンアップ）
//
// ヒント: useEffect の中で document.title = title とする
// ヒント: return () => { ... } でクリーンアップ関数を書く
export function PageTitle(_props: { title: string }) {
  return null;
}
