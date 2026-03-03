import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { counterReducer, CounterWithReducer } from '../exercises/01-basic-reducer';

describe('counterReducer（単体テスト）', () => {
  it('INCREMENT で count が1増える', () => {
    expect(counterReducer({ count: 5 }, { type: 'INCREMENT' })).toEqual({ count: 6 });
  });

  it('DECREMENT で count が1減る', () => {
    expect(counterReducer({ count: 5 }, { type: 'DECREMENT' })).toEqual({ count: 4 });
  });

  it('DECREMENT で 0 未満にならない', () => {
    expect(counterReducer({ count: 0 }, { type: 'DECREMENT' })).toEqual({ count: 0 });
  });

  it('RESET で count が 0 に戻る', () => {
    expect(counterReducer({ count: 10 }, { type: 'RESET' })).toEqual({ count: 0 });
  });
});

describe('CounterWithReducer コンポーネント', () => {
  it('初期状態で「カウント: 0」と表示する', () => {
    render(<CounterWithReducer />);
    expect(screen.getByText('カウント: 0')).toBeInTheDocument();
  });

  it('「増やす」ボタンで +1', async () => {
    const user = userEvent.setup();
    render(<CounterWithReducer />);
    await user.click(screen.getByRole('button', { name: '増やす' }));
    expect(screen.getByText('カウント: 1')).toBeInTheDocument();
  });

  it('「減らす」ボタンで -1', async () => {
    const user = userEvent.setup();
    render(<CounterWithReducer />);
    await user.click(screen.getByRole('button', { name: '増やす' }));
    await user.click(screen.getByRole('button', { name: '増やす' }));
    await user.click(screen.getByRole('button', { name: '減らす' }));
    expect(screen.getByText('カウント: 1')).toBeInTheDocument();
  });

  it('「リセット」ボタンで 0 に戻る', async () => {
    const user = userEvent.setup();
    render(<CounterWithReducer />);
    await user.click(screen.getByRole('button', { name: '増やす' }));
    await user.click(screen.getByRole('button', { name: '増やす' }));
    await user.click(screen.getByRole('button', { name: 'リセット' }));
    expect(screen.getByText('カウント: 0')).toBeInTheDocument();
  });
});
