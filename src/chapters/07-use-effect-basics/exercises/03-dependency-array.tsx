type LoggerProps = {
  message: string;
  onLog: (msg: string) => void;
};

// TODO: message が変わるたびに onLog を呼ぶコンポーネント
// 要件:
//   - マウント時に onLog(message) を呼ぶ
//   - message が変わったら再度 onLog(message) を呼ぶ
//   - message が同じなら呼ばない
//
// ヒント: useEffect の依存配列に何を入れるべきか考えよう
// ヒント: 画面に何も表示する必要はない（null を返してOK）
export function Logger(_props: LoggerProps) {
  return null;
}
