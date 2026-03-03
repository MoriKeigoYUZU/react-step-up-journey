import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../exercises/02-controlled-form';

describe('LoginForm コンポーネント', () => {
  it('メールアドレスとパスワードの入力欄がある', () => {
    render(<LoginForm onSubmit={() => {}} />);
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
  });

  it('送信ボタンがある', () => {
    render(<LoginForm onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
  });

  it('送信すると onSubmit が入力値で呼ばれる', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('パスワード'), 'secret');
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret',
    });
  });

  it('送信後にフォームがクリアされる', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('パスワード'), 'secret');
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(screen.getByLabelText('メールアドレス')).toHaveValue('');
    expect(screen.getByLabelText('パスワード')).toHaveValue('');
  });
});
