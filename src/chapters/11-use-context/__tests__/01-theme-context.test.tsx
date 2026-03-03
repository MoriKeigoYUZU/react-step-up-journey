import { render, screen } from '@testing-library/react';
import { ThemeProvider, ThemedButton } from '../exercises/01-theme-context';

describe('ThemeProvider と ThemedButton', () => {
  it('light テーマのとき btn-light クラスが適用される', () => {
    render(
      <ThemeProvider theme="light">
        <ThemedButton />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('btn-light');
  });

  it('dark テーマのとき btn-dark クラスが適用される', () => {
    render(
      <ThemeProvider theme="dark">
        <ThemedButton />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('btn-dark');
  });

  it('ボタンに「テーマボタン」というテキストが表示される', () => {
    render(
      <ThemeProvider theme="light">
        <ThemedButton />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('テーマボタン');
  });

  it('Provider なしではデフォルトテーマ（light）で動作する', () => {
    render(<ThemedButton />);
    expect(screen.getByRole('button')).toHaveClass('btn-light');
  });
});
