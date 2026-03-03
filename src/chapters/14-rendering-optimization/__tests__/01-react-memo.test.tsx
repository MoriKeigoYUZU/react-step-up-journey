import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpensiveList, MemoizedExpensiveList, ParentWithMemo, ParentWithoutMemo } from '../exercises/01-react-memo';

describe('ExpensiveList（メモ化なし）', () => {
  it('items をリスト表示する', () => {
    render(<ExpensiveList items={['A', 'B', 'C']} onItemClick={() => {}} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('レンダー回数を表示する', () => {
    render(<ExpensiveList items={['A']} onItemClick={() => {}} />);
    expect(screen.getByTestId('render-count')).toHaveTextContent('1');
  });
});

describe('ParentWithoutMemo', () => {
  it('親のstate変更で子も再レンダーする', async () => {
    const user = userEvent.setup();
    render(<ParentWithoutMemo />);
    const renderCount = screen.getByTestId('render-count');
    expect(renderCount).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: '親のカウント+1' }));
    expect(renderCount).toHaveTextContent('2');
  });
});

describe('ParentWithMemo', () => {
  it('親のstate変更で子は再レンダーしない', async () => {
    const user = userEvent.setup();
    render(<ParentWithMemo />);
    const renderCount = screen.getByTestId('render-count');
    expect(renderCount).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: '親のカウント+1' }));
    // memo版は再レンダーしないので render-count は1のまま
    expect(renderCount).toHaveTextContent('1');
  });
});
