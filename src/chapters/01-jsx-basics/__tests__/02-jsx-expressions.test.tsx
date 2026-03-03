import { render, screen } from '@testing-library/react';
import { UserCard, PriceTag } from '../exercises/02-jsx-expressions';

describe('UserCard コンポーネント', () => {
  it('name を h2 に「名前: {name}」と表示する', () => {
    render(<UserCard name="太郎" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('名前: 太郎');
  });

  it('異なる name でも正しく表示される', () => {
    render(<UserCard name="花子" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('名前: 花子');
  });
});

describe('PriceTag コンポーネント', () => {
  it('price を「価格: {price}円」と表示する', () => {
    render(<PriceTag price={1000} tax={0.1} />);
    expect(screen.getByText('価格: 1000円')).toBeInTheDocument();
  });

  it('税込価格を計算して表示する', () => {
    render(<PriceTag price={1000} tax={0.1} />);
    expect(screen.getByText('税込: 1100円')).toBeInTheDocument();
  });

  it('異なる価格でも正しく計算される', () => {
    render(<PriceTag price={500} tax={0.08} />);
    expect(screen.getByText('税込: 540円')).toBeInTheDocument();
  });
});
