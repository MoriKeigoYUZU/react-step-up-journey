import { render } from '@testing-library/react';
import { PageTitle } from '../exercises/01-document-title';

describe('PageTitle コンポーネント', () => {
  it('title に応じて document.title を変更する', () => {
    render(<PageTitle title="ホーム" />);
    expect(document.title).toBe('ホーム');
  });

  it('title が変わると document.title も変わる', () => {
    const { rerender } = render(<PageTitle title="ホーム" />);
    expect(document.title).toBe('ホーム');
    rerender(<PageTitle title="設定" />);
    expect(document.title).toBe('設定');
  });

  it('アンマウント時に document.title を空にする', () => {
    const { unmount } = render(<PageTitle title="ホーム" />);
    expect(document.title).toBe('ホーム');
    unmount();
    expect(document.title).toBe('');
  });
});
