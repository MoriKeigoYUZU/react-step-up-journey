import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProvider, UserStatus } from '../exercises/02-user-context';

describe('UserProvider と UserStatus', () => {
  it('未ログイン時に「ゲスト」と表示する', () => {
    render(
      <UserProvider>
        <UserStatus />
      </UserProvider>
    );
    expect(screen.getByText('ゲスト')).toBeInTheDocument();
  });

  it('「ログイン」ボタンをクリックすると名前が表示される', async () => {
    const user = userEvent.setup();
    render(
      <UserProvider>
        <UserStatus />
      </UserProvider>
    );
    await user.click(screen.getByRole('button', { name: 'ログイン' }));
    expect(screen.getByText('太郎')).toBeInTheDocument();
  });

  it('「ログアウト」ボタンで「ゲスト」に戻る', async () => {
    const user = userEvent.setup();
    render(
      <UserProvider>
        <UserStatus />
      </UserProvider>
    );
    await user.click(screen.getByRole('button', { name: 'ログイン' }));
    await user.click(screen.getByRole('button', { name: 'ログアウト' }));
    expect(screen.getByText('ゲスト')).toBeInTheDocument();
  });
});
