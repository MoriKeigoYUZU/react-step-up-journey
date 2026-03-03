/**
 * ここに今取り組んでいるエクササイズのコンポーネントを import して表示しよう！
 *
 * 使い方:
 *   1. 下の import のコメントを外して、今のエクササイズに合わせる
 *   2. <Preview> の中にコンポーネントを置く
 *   3. npm run dev でブラウザに表示される
 *
 * 例（Chapter 01, Exercise 01 の場合）:
 *   import { Greeting } from "./chapters/01-jsx-basics/exercises/01-first-jsx";
 *   → <Preview> の中に <Greeting /> を置く
 */

// ↓ ここを書き換えて使う --------------------------------------------------
// import { Greeting } from "./chapters/01-jsx-basics/exercises/01-first-jsx";
// -------------------------------------------------------------------------

function Preview({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
      <header style={{ borderBottom: "2px solid #eee", paddingBottom: "1rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.4rem", margin: 0 }}>React Step-Up Journey</h1>
        <p style={{ color: "#666", margin: "0.5rem 0 0" }}>
          ブラウザプレビュー
        </p>
      </header>
      <main>
        {children ?? (
          <div style={{ color: "#999", textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "1.2rem" }}>コンポーネントがまだ設定されていません</p>
            <p>このファイル (src/App.tsx) を開いて、</p>
            <p>import のコメントを外してコンポーネントを表示しよう！</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Preview>
      {/* ↓ ここにコンポーネントを置く。例: <Greeting /> */}
    </Preview>
  );
}
