// TODO: Header コンポーネントを作ろう
// 要件: <header> 要素の中に「サイトタイトル」を表示
export function Header() {
  return <header>サイトタイトル</header>;
}

// TODO: Footer コンポーネントを作ろう
// 要件: <footer> 要素の中に「© 2026」を表示
export function Footer() {
  return <footer>© 2026</footer>;
}

// TODO: Header と Footer を組み合わせた App を作ろう
// 要件: Header, main（メインコンテンツ）, Footer の構成
export function App() {
  return (
    <>
      <Header></Header>
      <main></main>
      <Footer></Footer>
    </>
  );
}
