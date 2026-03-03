// TODO: ON/OFF を切り替えるカスタムフック
// 要件:
//   - [value, toggle, setValue] を返す
//   - value: 現在の boolean 値
//   - toggle: 値を反転する関数
//   - setValue: 値を直接設定する関数
//   - 初期値のデフォルトは false
export function useToggle(_initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  return [false, () => {}, () => {}];
}

// TODO: useToggle を使ったデモコンポーネント
// 要件: ON/OFF 表示と「切り替え」ボタン
export function ToggleDemo() {
  return null;
}
