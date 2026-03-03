import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileForm } from '../exercises/03-multi-field-form';

describe('ProfileForm コンポーネント', () => {
  it('名前、メール、自己紹介の入力欄がある', () => {
    render(<ProfileForm />);
    expect(screen.getByLabelText('名前')).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('自己紹介')).toBeInTheDocument();
  });

  it('入力がリアルタイムでプレビューに反映される', async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(screen.getByLabelText('名前'), '太郎');
    const preview = screen.getByTestId('preview');
    expect(preview).toHaveTextContent('名前: 太郎');
  });

  it('すべてのフィールドがプレビューに反映される', async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(screen.getByLabelText('名前'), '太郎');
    await user.type(screen.getByLabelText('メールアドレス'), 'taro@example.com');
    await user.type(screen.getByLabelText('自己紹介'), 'よろしく');

    const preview = screen.getByTestId('preview');
    expect(preview).toHaveTextContent('名前: 太郎');
    expect(preview).toHaveTextContent('メール: taro@example.com');
    expect(preview).toHaveTextContent('自己紹介: よろしく');
  });
});
