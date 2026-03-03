import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../exercises/02-use-counter';

describe('useCounter フック', () => {
  it('初期値のデフォルトは 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('初期値を指定できる', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increment で +1', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it('decrement で -1', () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => result.current.decrement());
    expect(result.current.count).toBe(4);
  });

  it('reset で初期値に戻る', () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => result.current.increment());
    act(() => result.current.increment());
    act(() => result.current.reset());
    expect(result.current.count).toBe(10);
  });

  it('step オプションで増減量を変更できる', () => {
    const { result } = renderHook(() => useCounter(0, { step: 5 }));
    act(() => result.current.increment());
    expect(result.current.count).toBe(5);
  });

  it('min オプションで最小値を制限できる', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }));
    act(() => result.current.decrement());
    expect(result.current.count).toBe(0);
  });

  it('max オプションで最大値を制限できる', () => {
    const { result } = renderHook(() => useCounter(10, { max: 10 }));
    act(() => result.current.increment());
    expect(result.current.count).toBe(10);
  });
});
