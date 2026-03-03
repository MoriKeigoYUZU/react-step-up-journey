import { render, screen } from '@testing-library/react';
import { ProductCard } from '../exercises/02-multiple-props';

describe('ProductCard コンポーネント', () => {
  it('商品名を h3 で表示する', () => {
    render(<ProductCard name="React入門書" price={2000} inStock={true} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('React入門書');
  });

  it('価格を「{price}円」の形式で表示する', () => {
    render(<ProductCard name="React入門書" price={2000} inStock={true} />);
    expect(screen.getByTestId('price')).toHaveTextContent('2000円');
  });

  it('在庫ありのとき「在庫あり」と表示する', () => {
    render(<ProductCard name="React入門書" price={2000} inStock={true} />);
    expect(screen.getByText('在庫あり')).toBeInTheDocument();
  });

  it('在庫なしのとき「在庫なし」と表示する', () => {
    render(<ProductCard name="React入門書" price={2000} inStock={false} />);
    expect(screen.getByText('在庫なし')).toBeInTheDocument();
  });
});
