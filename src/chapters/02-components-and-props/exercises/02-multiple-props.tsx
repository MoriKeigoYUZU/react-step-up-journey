type ProductCardProps = {
  name: string;
  price: number;
  inStock: boolean;
};

// TODO: 商品カードを作ろう
// 要件:
//   - h3 に商品名
//   - span (data-testid="price") に「{price}円」
//   - span に在庫状態（「在庫あり」or「在庫なし」）
export function ProductCard(_props: ProductCardProps) {
  return (
    <>
      <h3>{_props.name}</h3>
      <span data-testid="price">{_props.price}円</span>
      <span>{_props.inStock ? "在庫あり" : "在庫なし"}</span>
    </>
  );
}
