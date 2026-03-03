import { render, screen } from '@testing-library/react';
import { Header, Footer, App } from '../exercises/03-component-composition';

describe('Header コンポーネント', () => {
  it('header 要素を返す', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('「サイトタイトル」というテキストを含む', () => {
    render(<Header />);
    expect(screen.getByText('サイトタイトル')).toBeInTheDocument();
  });
});

describe('Footer コンポーネント', () => {
  it('footer 要素を返す', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('「© 2026」というテキストを含む', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });
});

describe('App コンポーネント', () => {
  it('Header と Footer の両方が表示される', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('main 要素にメインコンテンツが含まれる', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
