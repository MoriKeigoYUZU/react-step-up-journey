type State = {
  count: number;
};

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' };

// TODO: Reducer 関数を作ろう
// 要件:
//   - INCREMENT: count を +1
//   - DECREMENT: count を -1（ただし 0 未満にはならない）
//   - RESET: count を 0 に戻す
export function counterReducer(_state: State, _action: Action): State {
  return { count: 0 };
}

// TODO: useReducer を使ったカウンター
// 要件:
//   - 「カウント: {count}」を表示
//   - 「増やす」「減らす」「リセット」の3つのボタン
export function CounterWithReducer() {
  return null;
}
