import { render, screen } from '@testing-library/react';
import { Greeting } from '../exercises/01-first-jsx';

describe('Greeting コンポーネント', () => {
  it('h1 に「こんにちは、React！」と表示される', () => {
    render(<Greeting />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('こんにちは、React！');
  });

  it('p タグに「JSXの世界へようこそ」と表示される', () => {
    render(<Greeting />);
    expect(screen.getByText('JSXの世界へようこそ')).toBeInTheDocument();
  });
});
