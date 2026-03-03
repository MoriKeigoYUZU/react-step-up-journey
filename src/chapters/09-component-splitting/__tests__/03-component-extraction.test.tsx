import { render, screen } from '@testing-library/react';
import { CartItem, ShoppingCart } from '../exercises/03-component-extraction';

const sampleItems = [
  { id: 1, name: 'りんご', price: 200, quantity: 3 },
  { id: 2, name: 'バナナ', price: 100, quantity: 5 },
  { id: 3, name: 'ぶどう', price: 500, quantity: 1 },
];

describe('CartItem コンポーネント', () => {
  it('商品名を表示する', () => {
    render(<CartItem name="りんご" price={200} quantity={3} />);
    expect(screen.getByText('りんご')).toBeInTheDocument();
  });

  it('小計（price × quantity）を表示する', () => {
    render(<CartItem name="りんご" price={200} quantity={3} />);
    expect(screen.getByText('600円')).toBeInTheDocument();
  });
});

describe('ShoppingCart コンポーネント', () => {
  it('各商品が表示される', () => {
    render(<ShoppingCart items={sampleItems} />);
    expect(screen.getByText('りんご')).toBeInTheDocument();
    expect(screen.getByText('バナナ')).toBeInTheDocument();
    expect(screen.getByText('ぶどう')).toBeInTheDocument();
  });

  it('合計金額を表示する', () => {
    render(<ShoppingCart items={sampleItems} />);
    // 200*3 + 100*5 + 500*1 = 600 + 500 + 500 = 1600
    expect(screen.getByTestId('total')).toHaveTextContent('1600円');
  });

  it('空のカートでは「カートは空です」と表示する', () => {
    render(<ShoppingCart items={[]} />);
    expect(screen.getByText('カートは空です')).toBeInTheDocument();
  });
});
