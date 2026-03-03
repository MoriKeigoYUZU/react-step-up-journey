import { render, screen } from '@testing-library/react';
import { Card } from '../exercises/01-children-prop';

describe('Card コンポーネント', () => {
  it('title を h2 で表示する', () => {
    render(<Card title="テスト">内容</Card>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('テスト');
  });

  it('children をレンダリングする', () => {
    render(<Card title="テスト"><p>カードの中身</p></Card>);
    expect(screen.getByText('カードの中身')).toBeInTheDocument();
  });

  it('className="card" の div でラップされている', () => {
    const { container } = render(<Card title="テスト">内容</Card>);
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  it('異なる children を受け取れる', () => {
    render(
      <Card title="リスト">
        <ul>
          <li>項目1</li>
          <li>項目2</li>
        </ul>
      </Card>
    );
    expect(screen.getByText('項目1')).toBeInTheDocument();
    expect(screen.getByText('項目2')).toBeInTheDocument();
  });
});
