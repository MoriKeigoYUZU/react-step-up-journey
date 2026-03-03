import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilteredList } from '../exercises/02-use-memo-callback';

describe('FilteredList コンポーネント', () => {
  const items = [1, 5, 10, 15, 20, 25, 30];

  it('threshold 以上のアイテムだけ表示する', () => {
    render(<FilteredList items={items} threshold={15} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.queryByText('10')).not.toBeInTheDocument();
  });

  it('フィルタ結果の件数を表示する', () => {
    render(<FilteredList items={items} threshold={15} />);
    expect(screen.getByTestId('count')).toHaveTextContent('4件');
  });

  it('検索ボックスがある', () => {
    render(<FilteredList items={items} threshold={15} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('検索に入力してもフィルタ結果は変わらない', async () => {
    const user = userEvent.setup();
    render(<FilteredList items={items} threshold={15} />);
    await user.type(screen.getByRole('textbox'), 'test');
    // フィルタ結果は threshold ベースなので変わらない
    expect(screen.getByTestId('count')).toHaveTextContent('4件');
  });
});
