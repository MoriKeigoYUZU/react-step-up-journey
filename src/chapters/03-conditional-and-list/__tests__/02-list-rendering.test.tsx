import { render, screen } from '@testing-library/react';
import { FruitList } from '../exercises/02-list-rendering';

describe('FruitList コンポーネント', () => {
  it('フルーツの配列をリスト表示する', () => {
    render(<FruitList fruits={['りんご', 'みかん', 'ぶどう']} />);
    expect(screen.getByText('りんご')).toBeInTheDocument();
    expect(screen.getByText('みかん')).toBeInTheDocument();
    expect(screen.getByText('ぶどう')).toBeInTheDocument();
  });

  it('li 要素の数が配列の長さと一致する', () => {
    render(<FruitList fruits={['りんご', 'みかん', 'ぶどう']} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('空配列のとき「フルーツがありません」と表示する', () => {
    render(<FruitList fruits={[]} />);
    expect(screen.getByText('フルーツがありません')).toBeInTheDocument();
  });

  it('空配列のとき ul 要素が表示されない', () => {
    render(<FruitList fruits={[]} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
