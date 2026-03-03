// TODO: useMemo と useCallback を使ったフィルタリングコンポーネント
// 要件:
//   - items のうち threshold 以上のものだけ表示
//   - フィルタ結果を useMemo でメモ化
//   - data-testid="count" にフィルタ結果の件数を「X件」と表示
//   - 検索ボックス（textbox）がある（フィルタには影響しない）
//
// ヒント: useMemo(() => items.filter(...), [items, threshold])
export function FilteredList(_props: { items: number[]; threshold: number }) {
  return null;
}
