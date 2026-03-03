import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '../exercises/02-toggle';

describe('Toggle コンポーネント', () => {
  it('初期状態で「OFF」と表示する', () => {
    render(<Toggle />);
    expect(screen.getByTestId('status')).toHaveTextContent('OFF');
  });

  it('「切り替え」ボタンをクリックすると「ON」になる', async () => {
    const user = userEvent.setup();
    render(<Toggle />);
    await user.click(screen.getByRole('button', { name: '切り替え' }));
    expect(screen.getByTestId('status')).toHaveTextContent('ON');
  });

  it('もう一度クリックすると「OFF」に戻る', async () => {
    const user = userEvent.setup();
    render(<Toggle />);
    const button = screen.getByRole('button', { name: '切り替え' });
    await user.click(button);
    await user.click(button);
    expect(screen.getByTestId('status')).toHaveTextContent('OFF');
  });
});
