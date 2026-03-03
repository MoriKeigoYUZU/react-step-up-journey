# Chapter 08: useEffectの実践

## データ取得: useEffectの最も一般的な使い方

前の章では `useEffect` の基本を学びました。
この章では、実際のアプリケーションで最もよく使う **「サーバーからデータを取得する」** パターンを学びます。

### アナロジー: レストランで料理を注文する

データ取得は **レストランでの注文** に似ています:

1. **注文する**（fetch を呼ぶ）
2. **待つ**（ローディング状態）
3. **料理が届く**（データ取得成功） or **問題が起きる**（エラー）

この3つの状態を管理するのが、データ取得の基本です。

---

## Loading / Error / Success の3つの状態

データを取得するコンポーネントは、常に **3つの状態のどれか** にあります:

```
Loading（読み込み中）→ Success（成功） or Error（失敗）
```

### コードで表現すると

```tsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchUser(userId)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;
  return <h1>{user.name}</h1>;
}
```

### アナロジー: 注文状況の表示

レストランに例えると:
- **Loading**: 「お料理を準備中です...」（厨房で作っている最中）
- **Success**: 「お待たせしました！」（料理がテーブルに届いた）
- **Error**: 「申し訳ございません、その料理は品切れです」（問題が発生）

ユーザーにとって大事なのは、**今どの状態にあるかが明確にわかる** ことです。
画面が真っ白で何も表示されないと、ユーザーは「壊れた？」と不安になりますよね。

---

## useEffectの中でasync/awaitを使うパターン

`useEffect` のコールバック関数自体を `async` にすることはできません。
でも、中で `async` 関数を定義して呼ぶことはできます。

```tsx
// NG: useEffect 自体を async にしてはいけない
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);

// OK: 中で async 関数を定義して呼ぶ
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchData();
      setData(data);
    } catch (err) {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
```

### なぜ useEffect 自体を async にできないのか

`useEffect` のコールバックが return するものは **クリーンアップ関数** です。
`async` 関数は `Promise` を返します。
React は return された値をクリーンアップ関数として扱おうとするので、
`Promise` が返ってくると「これは関数じゃない！」と混乱してしまうのです。

---

## レースコンディション: 順番が入れ替わる問題

### 問題: 古い結果が新しい結果を上書きしてしまう

こんなシナリオを考えてください:

1. ユーザーが「React」を検索 → サーバーにリクエスト送信
2. すぐに「Next」に変更 → サーバーにリクエスト送信
3. 「Next」の結果が先に返ってきて表示される ← OK
4. 「React」の結果が遅れて返ってきて、「Next」の結果を上書きしてしまう ← NG!

これが **レースコンディション（競合状態）** です。

### アナロジー: ピザの注文

ピザ屋で考えてみましょう:

1. 最初にマルゲリータを注文
2. 「やっぱりペペロニにして！」と変更
3. ペペロニが先に届く ← 食べたいのはこれ
4. 遅れてマルゲリータも届く ← もういらない！

ペペロニを食べているのに、後からマルゲリータが届いて「これが最新の注文です」と言われたら困りますよね。

### 解決策1: ignore フラグパターン

最もシンプルな解決策です。`useEffect` のクリーンアップで「古い結果は無視する」フラグを立てます。

```tsx
useEffect(() => {
  let ignore = false;  // フラグを用意

  const loadData = async () => {
    const result = await fetchData(query);
    if (!ignore) {       // フラグが立っていなければ結果を使う
      setData(result);
    }
  };

  loadData();

  return () => {
    ignore = true;       // クリーンアップでフラグを立てる
  };
}, [query]);
```

**仕組み:**
- `query` が変わると、**前の** useEffect のクリーンアップが実行されて `ignore = true` になる
- 前のリクエストの結果が返ってきても、`ignore` が `true` なので `setData` は呼ばれない
- **新しい** useEffect が実行されて、新しい `ignore = false` でリクエストが始まる

### 解決策2: AbortController

`AbortController` を使うと、リクエスト自体をキャンセルできます。
ignore フラグと違い、**サーバーへのリクエストも中止** されるので効率的です。

```tsx
useEffect(() => {
  const controller = new AbortController();

  const loadData = async () => {
    try {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal,
      });
      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('エラーが発生しました');
      }
      // AbortError は無視（キャンセルは正常な動作）
    }
  };

  loadData();

  return () => {
    controller.abort();  // リクエストをキャンセル
  };
}, [query]);
```

### どちらを使うべき？

| パターン | 使う場面 |
|----------|----------|
| ignore フラグ | シンプルで十分な場合。props で関数を受け取る場合など |
| AbortController | `fetch` API を直接使う場合。ネットワークリクエストを本当にキャンセルしたい場合 |

この章の演習では **ignore フラグパターン** を使います。
より実践的ですが、まずはシンプルなパターンから始めましょう。

---

## 依存配列の値が変わったら再取得するパターン

実際のアプリでは、「表示するデータのIDが変わったら、新しいデータを取得する」というパターンが非常に多いです。

```tsx
function PostDetail({ postId }: { postId: number }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    // postId が変わるたびに、新しいデータを取得
    fetchPost(postId).then(setPost);
  }, [postId]);  // ← postId を依存配列に入れる

  // ...
}
```

`postId` が `1` → `2` に変わると:
1. クリーンアップ関数が実行される（もしあれば）
2. 新しい `useEffect` が `postId = 2` で実行される
3. 新しいデータが取得されて画面が更新される

---

## エラーハンドリングのベストプラクティス

```tsx
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);       // 前のエラーをリセット
      const data = await fetchData();
      setData(data);
    } catch (err) {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);    // 成功でも失敗でもローディングは終了
    }
  };

  loadData();
}, []);
```

**ポイント:**
- `try/catch` でエラーをキャッチ
- `finally` で loading を `false` に（成功・失敗に関わらず）
- 再取得時にはエラー状態をリセット（`setError(null)`）

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | データ取得 | useEffect でデータを取得して表示する基本パターン |
| 02 | Loading / Error 状態 | 3つの状態（読み込み中・成功・失敗）を管理する |
| 03 | レースコンディション | 古い結果が新しい結果を上書きしない仕組み |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/08-use-effect-practical
```

---

## まとめ

- データ取得は `useEffect` の最も一般的な使い方
- **Loading / Error / Success** の3つの状態を管理する
- `useEffect` 自体を `async` にはできないが、中で `async` 関数を定義して呼べる
- **レースコンディション** に注意: 古い結果が新しい結果を上書きしないように
- **ignore フラグ** または **AbortController** で対策する
- 依存配列の値が変わったら自動的に再取得される
