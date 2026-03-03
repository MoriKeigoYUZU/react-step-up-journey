import { render, screen } from '@testing-library/react';
import { Layout } from '../exercises/01-slot-pattern';

describe('Layout コンポーネント', () => {
  it('header スロットが header 要素の中にレンダリングされる', () => {
    render(
      <Layout header={<h1>タイトル</h1>} sidebar={<nav>ナビ</nav>}>
        本文
      </Layout>
    );
    const header = screen.getByRole('banner');
    expect(header).toHaveTextContent('タイトル');
  });

  it('sidebar スロットが aside 要素の中にレンダリングされる', () => {
    render(
      <Layout header={<h1>タイトル</h1>} sidebar={<nav>ナビ</nav>}>
        本文
      </Layout>
    );
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveTextContent('ナビ');
  });

  it('children が main 要素の中にレンダリングされる', () => {
    render(
      <Layout header={<h1>タイトル</h1>} sidebar={<nav>ナビ</nav>}>
        本文
      </Layout>
    );
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('本文');
  });

  it('3つのセクションが全て存在する', () => {
    render(
      <Layout header={<h1>タイトル</h1>} sidebar={<nav>ナビ</nav>}>
        本文
      </Layout>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
