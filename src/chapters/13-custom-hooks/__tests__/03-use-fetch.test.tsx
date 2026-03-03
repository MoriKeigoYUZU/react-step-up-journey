import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../exercises/03-use-fetch';

describe('useFetch フック', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('初期状態で loading が true', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
    const { result } = renderHook(() => useFetch<string>('https://api.example.com/data'));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('成功時に data がセットされる', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'hello' }),
    }));
    const { result } = renderHook(() => useFetch<{ message: string }>('https://api.example.com/data'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual({ message: 'hello' });
    expect(result.current.error).toBeNull();
  });

  it('失敗時に error がセットされる', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }));
    const { result } = renderHook(() => useFetch<unknown>('https://api.example.com/data'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it('url が変わると再fetchする', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve('first') })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve('second') });
    vi.stubGlobal('fetch', mockFetch);

    const { result, rerender } = renderHook(
      ({ url }) => useFetch<string>(url),
      { initialProps: { url: 'https://api.example.com/1' } }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe('first');

    rerender({ url: 'https://api.example.com/2' });
    await waitFor(() => expect(result.current.data).toBe('second'));
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
