type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
};

// TODO: ログインフォームを作ろう
// 要件:
//   - 「メールアドレス」ラベル + input
//   - 「パスワード」ラベル + input (type="password")
//   - 「送信」ボタン
//   - 送信時に onSubmit({ email, password }) を呼ぶ
//   - 送信後にフォームをクリア
//
// ヒント: input の value と onChange を state で制御する（制御コンポーネント）
// ヒント: form の onSubmit で e.preventDefault() を忘れずに
export function LoginForm(_props: LoginFormProps) {
  return null;
}
