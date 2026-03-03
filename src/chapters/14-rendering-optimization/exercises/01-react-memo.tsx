import { useRef, memo, useState, useCallback } from 'react';

type ExpensiveListProps = {
  items: string[];
  onItemClick: (item: string) => void;
};

// TODO: メモ化なしのリストコンポーネント
// 要件:
//   - items を ul > li で表示
//   - 各 li クリックで onItemClick(item) を呼ぶ
//   - useRef でレンダー回数を追跡し data-testid="render-count" で表示
export function ExpensiveList(_props: ExpensiveListProps) {
  void useRef;
  return null;
}

// TODO: React.memo でメモ化したバージョン
export const MemoizedExpensiveList = memo(ExpensiveList);

// TODO: メモ化なし版を使う親コンポーネント
// 要件:
//   - 「親のカウント+1」ボタンで自身のstateを更新
//   - ExpensiveList に固定の items を渡す
export function ParentWithoutMemo() {
  void useState;
  return null;
}

// TODO: メモ化あり版を使う親コンポーネント
// 要件:
//   - 「親のカウント+1」ボタンで自身のstateを更新
//   - MemoizedExpensiveList に固定の items を渡す
//   - useCallback で onItemClick を安定させる
export function ParentWithMemo() {
  void useState;
  void useCallback;
  return null;
}
