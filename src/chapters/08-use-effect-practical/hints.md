# Chapter 08: useEffectの実践 - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: データ取得

### レベル1（そっと後押し）
このエクササイズでは、マウント時にデータを取得して表示するパターンを練習します。
必要なものは:
- `useState` でユーザーリストと loading 状態を管理する
- `useEffect` の中でデータを取得する

テストを見ると、「読み込み中...」と表示してから、データ取得後にユーザー名が表示されることを求めています。

### レベル2（もう少し具体的に）
2つの state が必要です:
- `users`: ユーザーの配列（最初は空 `[]`）
- `loading`: 読み込み中かどうか（最初は `true`）

`useEffect` の中で:
1. `fetchUsers()` を呼ぶ（props で受け取る関数）
2. 結果を `setUsers` で保存
3. `setLoading(false)` でローディング終了

JSX では:
- `loading` が `true` なら「読み込み中...」を表示
- `false` ならユーザーリストを表示

### レベル3（ほぼ答え）
```tsx
import { useState, useEffect } from 'react';

export function UserList(props: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await props.fetchUsers();
      setUsers(data);
      setLoading(false);
    };
    loadUsers();
  }, []);

  if (loading) return <p>読み込み中...</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Exercise 02: Loading / Error 状態

### レベル1（そっと後押し）
Exercise 01 の応用です。今回は **エラー状態** も管理する必要があります。
テストを見ると、4つのケースがあります:
1. 読み込み中の表示
2. 成功時の表示
3. 失敗時の表示
4. `postId` が変わったら再取得

`try/catch` でエラーをキャッチしましょう。

### レベル2（もう少し具体的に）
3つの state が必要です:
- `post`: 投稿データ（最初は `null`）
- `loading`: 読み込み中か（最初は `true`）
- `error`: エラーがあるか（最初は `false`）

`useEffect` の依存配列に `postId` を入れて、`postId` が変わったら再取得します。
エラー時は `catch` で `setError(true)` して、JSX で「エラーが発生しました」を表示。

### レベル3（ほぼ答え）
```tsx
import { useState, useEffect } from 'react';

export function PostDetail(props: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await props.fetchPost(props.postId);
        setPost(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [props.postId]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました</p>;
  if (!post) return null;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  );
}
```

---

## Exercise 03: レースコンディション

### レベル1（そっと後押し）
これが一番難しいエクササイズです。
「古い検索結果が、新しい結果を上書きしてしまう」問題を防ぎます。

README の「レースコンディション」のセクションをもう一度読んでみてください。
`ignore` フラグを使うパターンがポイントです。

### レベル2（もう少し具体的に）
`useEffect` の中で:
1. `let ignore = false;` を宣言
2. 非同期で `search(query)` を呼ぶ
3. 結果が返ってきたとき、`if (!ignore)` で結果を使うかチェック
4. クリーンアップで `ignore = true` にする

`query` が空のときは `search` を呼ばずに、結果を空配列にする。

### レベル3（ほぼ答え）
```tsx
import { useState, useEffect } from 'react';

export function SearchResults(props: SearchResultsProps) {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (props.query === '') {
      setResults([]);
      return;
    }

    let ignore = false;

    const doSearch = async () => {
      const data = await props.search(props.query);
      if (!ignore) {
        setResults(data);
      }
    };
    doSearch();

    return () => {
      ignore = true;
    };
  }, [props.query]);

  return (
    <ul>
      {results.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```
`ignore` フラグのおかげで、`query` が変わった後に古い結果が返ってきても無視されます。
