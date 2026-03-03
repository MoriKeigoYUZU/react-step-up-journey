type AlertProps = {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
};

// TODO: 再利用可能なアラートコンポーネント
// 要件:
//   - div に className="alert-{type}" を適用
//   - p にメッセージを表示
//   - onClose が指定されたときだけ「閉じる」ボタンを表示
//   - ボタンクリックで onClose を呼ぶ
export function Alert(_props: AlertProps) {
  return null;
}
