import { render, screen } from '@testing-library/react';
import { Button } from '../exercises/01-basic-props';

describe('Button コンポーネント', () => {
  it('label を受け取りボタンのテキストとして表示する', () => {
    render(<Button label="送信" />);
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
  });

  it('異なる label で異なるテキストが表示される', () => {
    render(<Button label="キャンセル" />);
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('ボタンとしてレンダリングされる（button 要素）', () => {
    render(<Button label="テスト" />);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });
});
