import { ReactNode } from 'react';

type LayoutProps = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

// TODO: 3つのスロットを持つレイアウトコンポーネント
// 要件:
//   - header → <header> の中にレンダリング
//   - sidebar → <aside> の中にレンダリング
//   - children → <main> の中にレンダリング
export function Layout(_props: LayoutProps) {
  return null;
}
