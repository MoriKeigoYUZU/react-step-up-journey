import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useToggle, ToggleDemo } from '../exercises/01-use-toggle';

describe('useToggle フック', () => {
  it('初期値は false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('初期値を true に指定できる', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('toggle() で値が反転する', () => {
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
  });

  it('toggle() を2回呼ぶと元に戻る', () => {
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current[1]();
    });
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });

  it('setValue() で直接値を設定できる', () => {
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current[2](true);
    });
    expect(result.current[0]).toBe(true);
  });
});

describe('ToggleDemo コンポーネント', () => {
  it('初期状態で「OFF」と表示する', () => {
    render(<ToggleDemo />);
    expect(screen.getByText('OFF')).toBeInTheDocument();
  });

  it('ボタンクリックで「ON」に切り替わる', async () => {
    const user = userEvent.setup();
    render(<ToggleDemo />);
    await user.click(screen.getByRole('button', { name: '切り替え' }));
    expect(screen.getByText('ON')).toBeInTheDocument();
  });
});
