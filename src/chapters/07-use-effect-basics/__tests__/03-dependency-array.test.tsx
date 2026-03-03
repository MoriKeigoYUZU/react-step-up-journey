import { render } from '@testing-library/react';
import { Logger } from '../exercises/03-dependency-array';

describe('Logger コンポーネント', () => {
  it('初回レンダーで onLog が1回呼ばれる', () => {
    const onLog = vi.fn();
    render(<Logger message="hello" onLog={onLog} />);
    expect(onLog).toHaveBeenCalledTimes(1);
    expect(onLog).toHaveBeenCalledWith('hello');
  });

  it('message が変わると onLog が再度呼ばれる', () => {
    const onLog = vi.fn();
    const { rerender } = render(<Logger message="hello" onLog={onLog} />);
    rerender(<Logger message="world" onLog={onLog} />);
    expect(onLog).toHaveBeenCalledTimes(2);
    expect(onLog).toHaveBeenLastCalledWith('world');
  });

  it('message が同じ値で再レンダーしても onLog は追加で呼ばれない', () => {
    const onLog = vi.fn();
    const { rerender } = render(<Logger message="hello" onLog={onLog} />);
    rerender(<Logger message="hello" onLog={onLog} />);
    expect(onLog).toHaveBeenCalledTimes(1);
  });
});
