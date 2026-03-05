// TODO: name を受け取って「名前: {name}」と表示する UserCard を作ろう
export function UserCard(_props: { name: string }) {
  return (
    <>
      <h2>名前: {_props.name}</h2>
    </>
  );
}

// TODO: price と tax を受け取って価格と税込価格を表示する PriceTag を作ろう
// ヒント: JSX の中で {} を使うと JavaScript の式が書ける
export function PriceTag(_props: { price: number; tax: number }) {
  return <>
    <p>価格: {_props.price}円</p>
    <p>税込: {_props.price * (1 + _props.tax)}円</p>
  </>;
}
