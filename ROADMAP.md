# React Step-Up Journey ロードマップ

> テストを読む → 実装する → テストが緑になる → なぜ動くか理解する

## 進め方

1. 各チャプターの `README.md` を読んでコンセプトを理解する
2. `__tests__/` のテストファイルを読む（これが「仕様書」）
3. `exercises/` のファイルに実装を書く
4. `npm run test:chapter -- src/chapters/XX-xxx/` でテストを実行
5. 全テストが緑になったら、Claudeと「なぜ動くのか」を議論する

詰まったら `hints.md` を見てOK。それでもわからなければ Claude に聞こう。

---

## PART 1: 土台をつくる

> 「表示する」だけの世界。状態変化なし。React の基本構造を固める。

### Chapter 01: JSXってなに？
📁 `src/chapters/01-jsx-basics/`

JSXは「HTMLに似ているけどJavaScript」。この章では JSX が裏側で何をしているのか、どんなルールがあるのかを学びます。

- [ ] Exercise 01: はじめてのJSX
- [ ] Exercise 02: JSXの中で式を使う
- [ ] Exercise 03: JSXのルール

### Chapter 02: コンポーネントとProps
📁 `src/chapters/02-components-and-props/`

コンポーネントは「UIの部品」。Props は「外からもらう情報」。部品を作って組み合わせる考え方を学びます。

- [ ] Exercise 01: Propsの基本
- [ ] Exercise 02: 複数のProps
- [ ] Exercise 03: コンポーネントの組み合わせ

### Chapter 03: 条件分岐とリスト表示
📁 `src/chapters/03-conditional-and-list/`

「ログインしてたら〇〇を表示」「配列の中身をリストで表示」。動的なUIの第一歩。

- [ ] Exercise 01: 条件分岐レンダリング
- [ ] Exercise 02: リストレンダリング
- [ ] Exercise 03: オブジェクト配列のリスト

---

## PART 2:「状態」を理解する

> 画面が「変わる」仕組み。React の核心。

### Chapter 04: useState 入門
📁 `src/chapters/04-use-state-basics/`

「状態」とは「React が覚えている値」。useState を使うと、ボタンを押したら画面が変わる。

- [ ] Exercise 01: カウンター
- [ ] Exercise 02: ON/OFFトグル
- [ ] Exercise 03: 名前表示

### Chapter 05: useState 応用
📁 `src/chapters/05-use-state-advanced/`

オブジェクトや配列を state で管理するとき、「直接変更してはいけない」ルールがある。なぜ？

- [ ] Exercise 01: オブジェクトのstate
- [ ] Exercise 02: 配列のstate
- [ ] Exercise 03: 関数型更新

### Chapter 06: イベントとフォーム
📁 `src/chapters/06-events-and-forms/`

ユーザーの操作（クリック、入力、送信）に反応する方法。「制御コンポーネント」パターン。

- [ ] Exercise 01: イベントハンドラ
- [ ] Exercise 02: 制御フォーム
- [ ] Exercise 03: 複数フィールドフォーム

---

## PART 3: 副作用を理解する

> 「画面の外」で起こること。API通信、タイマー、document の操作。

### Chapter 07: useEffect 入門
📁 `src/chapters/07-use-effect-basics/`

useEffect は「Reactが画面を描き終わった後にやること」。依存配列とクリーンアップを理解する。

- [ ] Exercise 01: document.title の変更
- [ ] Exercise 02: タイマー
- [ ] Exercise 03: 依存配列の理解

### Chapter 08: useEffect 実践
📁 `src/chapters/08-use-effect-practical/`

データ取得、ローディング表示、エラー処理。そしてレースコンディション対策。

- [ ] Exercise 01: データフェッチング
- [ ] Exercise 02: ローディングとエラー
- [ ] Exercise 03: レースコンディション対策

---

## PART 4: コンポーネント設計

> 「動くもの」から「良い設計」へ。

### Chapter 09: コンポーネント分割
📁 `src/chapters/09-component-splitting/`

大きなコンポーネントを「ちょうどいい大きさ」に分ける。children を使った柔軟な設計。

- [ ] Exercise 01: children prop
- [ ] Exercise 02: 再利用可能コンポーネント
- [ ] Exercise 03: コンポーネント抽出

### Chapter 10: コンポジションパターン
📁 `src/chapters/10-composition-patterns/`

「継承より合成」。スロットパターンとCompound Components で柔軟なUIを作る。

- [ ] Exercise 01: スロットパターン
- [ ] Exercise 02: Compound Components

---

## PART 5: 状態管理の深掘り

> 複雑なアプリケーションの状態をどう管理するか。

### Chapter 11: useContext
📁 `src/chapters/11-use-context/`

Props の「バケツリレー」を解消する。アプリ全体で共有したい情報（テーマ、ユーザー情報など）。

- [ ] Exercise 01: テーマContext
- [ ] Exercise 02: ユーザーContext

### Chapter 12: useReducer
📁 `src/chapters/12-use-reducer/`

「何が起きたか（アクション）」と「その結果どうなるか（Reducer）」を分離する。

- [ ] Exercise 01: 基本のReducer
- [ ] Exercise 02: Todo Reducer

### Chapter 13: カスタムフック
📁 `src/chapters/13-custom-hooks/`

ロジックを「自分だけの道具」として切り出す。再利用とテストのしやすさ。

- [ ] Exercise 01: useToggle
- [ ] Exercise 02: useCounter
- [ ] Exercise 03: useFetch

---

## PART 6: パフォーマンスと実践

> 仕上げ。最適化の考え方と、全知識の統合。

### Chapter 14: 再レンダリングの最適化
📁 `src/chapters/14-rendering-optimization/`

React.memo, useMemo, useCallback。「必要なときだけ」最適化する原則。

- [ ] Exercise 01: React.memo
- [ ] Exercise 02: useMemo と useCallback

### Chapter 15: 最終プロジェクト
📁 `src/chapters/15-final-project/`

ブックマークマネージャーを作る。これまでの全知識を自分の判断で組み合わせる。

- [ ] Exercise 01: ブックマークモデル（カスタムフック）
- [ ] Exercise 02: ブックマークUI（コンポーネント群）
- [ ] Exercise 03: ブックマークアプリ（統合）

---

## コマンドまとめ

```bash
# 開発サーバー起動
npm run dev

# 全テスト実行
npm test

# チャプター単位でテスト
npm run test:chapter -- src/chapters/01-jsx-basics/

# 特定のエクササイズだけテスト
npx vitest --reporter=verbose src/chapters/01-jsx-basics/__tests__/01-first-jsx.test.tsx

# テストをウォッチモードで実行（ファイル保存で自動再実行）
npm test -- src/chapters/01-jsx-basics/
```
