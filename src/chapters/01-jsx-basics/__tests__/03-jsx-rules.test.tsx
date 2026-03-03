import { render, screen } from '@testing-library/react';
import { ProfileCard } from '../exercises/03-jsx-rules';

describe('ProfileCard コンポーネント', () => {
  it('className="profile-card" の div でラップされている', () => {
    const { container } = render(<ProfileCard />);
    expect(container.querySelector('.profile-card')).toBeInTheDocument();
  });

  it('img タグに alt 属性が設定されている', () => {
    render(<ProfileCard />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'プロフィール画像');
  });

  it('名前が h2 で表示されている', () => {
    render(<ProfileCard />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('山田太郎');
  });

  it('自己紹介文が p タグで表示されている', () => {
    render(<ProfileCard />);
    expect(screen.getByText('Reactを勉強中です')).toBeInTheDocument();
  });
});
