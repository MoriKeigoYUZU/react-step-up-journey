import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NameDisplay } from '../exercises/03-name-display';

describe('NameDisplay コンポーネント', () => {
  it('初期状態で「名前: 」と表示する（空文字）', () => {
    render(<NameDisplay />);
    expect(screen.getByText('名前:')).toBeInTheDocument();
  });

  it('入力欄に「太郎」と入力すると「名前: 太郎」に変わる', async () => {
    const user = userEvent.setup();
    render(<NameDisplay />);
    await user.type(screen.getByRole('textbox'), '太郎');
    expect(screen.getByText('名前: 太郎')).toBeInTheDocument();
  });

  it('入力を変えると表示も変わる', async () => {
    const user = userEvent.setup();
    render(<NameDisplay />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'ABC');
    expect(screen.getByText('名前: ABC')).toBeInTheDocument();
  });
});
