import { render, screen, act } from '@testing-library/react';
import { Timer } from '../exercises/02-timer';

describe('Timer コンポーネント', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態で「経過: 0秒」と表示する', () => {
    render(<Timer />);
    expect(screen.getByText('経過: 0秒')).toBeInTheDocument();
  });

  it('1秒後に「経過: 1秒」と表示する', () => {
    render(<Timer />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('経過: 1秒')).toBeInTheDocument();
  });

  it('3秒後に「経過: 3秒」と表示する', () => {
    render(<Timer />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('経過: 3秒')).toBeInTheDocument();
  });

  it('アンマウント時にタイマーがクリアされる', () => {
    const { unmount } = render(<Timer />);
    unmount();
    // After unmount, advancing timers should not cause errors
    act(() => {
      vi.advanceTimersByTime(5000);
    });
  });
});
