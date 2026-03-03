import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClickTracker } from '../exercises/01-event-handler';

describe('ClickTracker コンポーネント', () => {
  it('初期状態で「クリック回数: 0」と表示する', () => {
    render(<ClickTracker />);
    expect(screen.getByText('クリック回数: 0')).toBeInTheDocument();
  });

  it('ボタンをクリックするとクリック回数が増える', async () => {
    const user = userEvent.setup();
    render(<ClickTracker />);
    await user.click(screen.getByRole('button', { name: 'ボタンA' }));
    expect(screen.getByText('クリック回数: 1')).toBeInTheDocument();
  });

  it('最後にクリックしたボタンのラベルを表示する', async () => {
    const user = userEvent.setup();
    render(<ClickTracker />);
    await user.click(screen.getByRole('button', { name: 'ボタンA' }));
    expect(screen.getByText('最後のクリック: ボタンA')).toBeInTheDocument();
  });

  it('別のボタンをクリックすると最後のクリックが更新される', async () => {
    const user = userEvent.setup();
    render(<ClickTracker />);
    await user.click(screen.getByRole('button', { name: 'ボタンA' }));
    await user.click(screen.getByRole('button', { name: 'ボタンB' }));
    expect(screen.getByText('クリック回数: 2')).toBeInTheDocument();
    expect(screen.getByText('最後のクリック: ボタンB')).toBeInTheDocument();
  });
});
