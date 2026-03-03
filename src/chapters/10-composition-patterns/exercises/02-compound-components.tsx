import { ReactNode } from 'react';

// TODO: アコーディオンのコンテナ
// 要件: children をそのままレンダリングする
export function Accordion(_props: { children: ReactNode }) {
  return null;
}

// TODO: アコーディオンの各項目（クリックで展開/折りたたみ）
// 要件:
//   - title をボタンで表示
//   - クリックで children の表示/非表示を切り替え
//   - 各 AccordionItem は独立して動作する
export function AccordionItem(_props: { title: string; children: ReactNode }) {
  return null;
}
