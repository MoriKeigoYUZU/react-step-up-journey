// TODO: プロフィールカードを作ろう
// 要件:
//   - div (className="profile-card") でラップ
//   - img タグ (alt="プロフィール画像", src は何でもOK)
//   - h2 に名前「山田太郎」
//   - p に自己紹介「Reactを勉強中です」
//
// ヒント: JSXでは class ではなく className を使う
// ヒント: <img> は自己閉じタグ <img /> にする
export function ProfileCard() {
  return (
    <div className="profile-card">
      <img alt="プロフィール画像" src="https://via.placeholder.com/150" />
      <h2>山田太郎</h2>
      <p>Reactを勉強中です</p>
    </div>
  );
}
