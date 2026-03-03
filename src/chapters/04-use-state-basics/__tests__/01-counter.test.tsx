import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../exercises/01-counter';

describe('Counter コンポーネント', () => {
  it('初期状態で「カウント: 0」と表示する', () => {
    render(<Counter />);
    expect(screen.getByText('カウント: 0')).toBeInTheDocument();
  });

  it('「+1」ボタンをクリックすると「カウント: 1」になる', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole('button', { name: '+1' }));
    expect(screen.getByText('カウント: 1')).toBeInTheDocument();
  });

  it('3回クリックすると「カウント: 3」になる', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    const button = screen.getByRole('button', { name: '+1' });
    await user.click(button);
    await user.click(button);
    await user.click(button);
    expect(screen.getByText('カウント: 3')).toBeInTheDocument();
  });
});
