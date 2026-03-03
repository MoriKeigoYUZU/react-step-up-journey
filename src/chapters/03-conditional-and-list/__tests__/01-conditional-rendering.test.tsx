import { render, screen } from '@testing-library/react';
import { LoginStatus, AdminBadge } from '../exercises/01-conditional-rendering';

describe('LoginStatus コンポーネント', () => {
  it('ログイン時に「ようこそ！」と表示する', () => {
    render(<LoginStatus isLoggedIn={true} />);
    expect(screen.getByText('ようこそ！')).toBeInTheDocument();
  });

  it('未ログイン時に「ログインしてください」と表示する', () => {
    render(<LoginStatus isLoggedIn={false} />);
    expect(screen.getByText('ログインしてください')).toBeInTheDocument();
  });

  it('ログイン時に「ログインしてください」は表示されない', () => {
    render(<LoginStatus isLoggedIn={true} />);
    expect(screen.queryByText('ログインしてください')).not.toBeInTheDocument();
  });
});

describe('AdminBadge コンポーネント', () => {
  it('管理者のとき「管理者」バッジを表示する', () => {
    render(<AdminBadge isAdmin={true} />);
    expect(screen.getByText('管理者')).toBeInTheDocument();
  });

  it('管理者でないときバッジを表示しない', () => {
    render(<AdminBadge isAdmin={false} />);
    expect(screen.queryByText('管理者')).not.toBeInTheDocument();
  });
});
