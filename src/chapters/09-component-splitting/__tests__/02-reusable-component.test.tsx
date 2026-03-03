import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from '../exercises/02-reusable-component';

describe('Alert コンポーネント', () => {
  it('message を p タグで表示する', () => {
    render(<Alert type="info" message="お知らせです" />);
    expect(screen.getByText('お知らせです')).toBeInTheDocument();
  });

  it('type="success" のとき className="alert-success" が適用される', () => {
    const { container } = render(<Alert type="success" message="成功" />);
    expect(container.querySelector('.alert-success')).toBeInTheDocument();
  });

  it('type="error" のとき className="alert-error" が適用される', () => {
    const { container } = render(<Alert type="error" message="エラー" />);
    expect(container.querySelector('.alert-error')).toBeInTheDocument();
  });

  it('type="info" のとき className="alert-info" が適用される', () => {
    const { container } = render(<Alert type="info" message="情報" />);
    expect(container.querySelector('.alert-info')).toBeInTheDocument();
  });

  it('onClose が指定されたとき「閉じる」ボタンが表示される', () => {
    render(<Alert type="info" message="テスト" onClose={() => {}} />);
    expect(screen.getByRole('button', { name: '閉じる' })).toBeInTheDocument();
  });

  it('onClose が未指定のとき「閉じる」ボタンは表示されない', () => {
    render(<Alert type="info" message="テスト" />);
    expect(screen.queryByRole('button', { name: '閉じる' })).not.toBeInTheDocument();
  });

  it('「閉じる」ボタンクリックで onClose が呼ばれる', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<Alert type="info" message="テスト" onClose={handleClose} />);
    await user.click(screen.getByRole('button', { name: '閉じる' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
