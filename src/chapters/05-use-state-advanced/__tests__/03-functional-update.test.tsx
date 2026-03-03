import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BatchCounter } from '../exercises/03-functional-update';

describe('BatchCounter コンポーネント', () => {
  it('初期状態で「カウント: 0」と表示する', () => {
    render(<BatchCounter />);
    expect(screen.getByText('カウント: 0')).toBeInTheDocument();
  });

  it('「3回増やす」ボタンをクリックすると「カウント: 3」になる', async () => {
    const user = userEvent.setup();
    render(<BatchCounter />);
    await user.click(screen.getByRole('button', { name: '3回増やす' }));
    expect(screen.getByText('カウント: 3')).toBeInTheDocument();
  });

  it('「3回増やす」を2回クリックすると「カウント: 6」になる', async () => {
    const user = userEvent.setup();
    render(<BatchCounter />);
    const button = screen.getByRole('button', { name: '3回増やす' });
    await user.click(button);
    await user.click(button);
    expect(screen.getByText('カウント: 6')).toBeInTheDocument();
  });

  it('「リセット」ボタンで0に戻る', async () => {
    const user = userEvent.setup();
    render(<BatchCounter />);
    await user.click(screen.getByRole('button', { name: '3回増やす' }));
    await user.click(screen.getByRole('button', { name: 'リセット' }));
    expect(screen.getByText('カウント: 0')).toBeInTheDocument();
  });
});
