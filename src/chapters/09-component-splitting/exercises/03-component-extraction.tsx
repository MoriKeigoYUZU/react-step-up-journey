type Item = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

// TODO: 個別の商品を表示するコンポーネント
// 要件: 商品名と小計（price × quantity）を表示
export function CartItem(_props: { name: string; price: number; quantity: number }) {
  return null;
}

// TODO: 商品リストと合計金額を表示するコンポーネント
// 要件:
//   - 各アイテムを CartItem で表示
//   - 合計金額を data-testid="total" の要素に表示
//   - 空の場合は「カートは空です」を表示
export function ShoppingCart(_props: { items: Item[] }) {
  return null;
}
