import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../exercises/01-object-state';

describe('UserProfile コンポーネント', () => {
  it('初期状態で名前と年齢を表示する', () => {
    render(<UserProfile />);
    expect(screen.getByText('名前: 太郎')).toBeInTheDocument();
    expect(screen.getByText('年齢: 20')).toBeInTheDocument();
  });

  it('「名前を変更」ボタンで名前が「次郎」に変わる', async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getByRole('button', { name: '名前を変更' }));
    expect(screen.getByText('名前: 次郎')).toBeInTheDocument();
  });

  it('名前を変更しても年齢は変わらない', async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getByRole('button', { name: '名前を変更' }));
    expect(screen.getByText('年齢: 20')).toBeInTheDocument();
  });
});
