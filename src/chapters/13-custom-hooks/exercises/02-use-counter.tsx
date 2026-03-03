type UseCounterOptions = {
  step?: number;
  min?: number;
  max?: number;
};

type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

// TODO: 高機能なカウンターフック
// 要件:
//   - count: 現在の値
//   - increment: step 分増やす（max を超えない）
//   - decrement: step 分減らす（min を下回らない）
//   - reset: 初期値に戻す
//   - step のデフォルトは 1
export function useCounter(_initialValue: number = 0, _options: UseCounterOptions = {}): UseCounterReturn {
  return { count: 0, increment: () => {}, decrement: () => {}, reset: () => {} };
}
