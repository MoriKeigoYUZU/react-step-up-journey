# Chapter 15: 最終プロジェクト - ヒント集

> 詰まったときは、まずレベル1のヒントから読んでみてください。
> それでもわからなければレベル2、レベル3と進んでください。

---

## Exercise 01: ブックマークモデル（useBookmarks フック）

### レベル1（そっと後押し）
Chapter 12 の `useReducer` と Chapter 13 のカスタムフックを組み合わせます。

まず、どんなアクションが必要か考えてください:
- ブックマークを追加する（title, url を受け取る）
- ブックマークを削除する（id で指定）
- お気に入りを切り替える（id で指定）

reducer の中で、各アクションに対応する新しい state を返します。

### レベル2（もう少し具体的に）
Reducer の state: `{ bookmarks: Bookmark[], nextId: number }`

アクション:
- `ADD`: `{ id: nextId, title, url, favorite: false }` を追加、`nextId + 1`
- `REMOVE`: `bookmarks.filter(b => b.id !== action.id)`
- `TOGGLE_FAVORITE`: `bookmarks.map(b => b.id === action.id ? { ...b, favorite: !b.favorite } : b)`

カスタムフックでは `useReducer` を使い、`dispatch` をラップした関数を返します:
```tsx
const addBookmark = (title: string, url: string) => {
  dispatch({ type: 'ADD', title, url });
};
```

### レベル3（ほぼ答え）
```tsx
type State = { bookmarks: Bookmark[]; nextId: number };
type Action =
  | { type: 'ADD'; title: string; url: string }
  | { type: 'REMOVE'; id: number }
  | { type: 'TOGGLE_FAVORITE'; id: number };

function bookmarkReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return {
        bookmarks: [...state.bookmarks, {
          id: state.nextId, title: action.title, url: action.url, favorite: false
        }],
        nextId: state.nextId + 1,
      };
    case 'REMOVE':
      return { ...state, bookmarks: state.bookmarks.filter(b => b.id !== action.id) };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        bookmarks: state.bookmarks.map(b =>
          b.id === action.id ? { ...b, favorite: !b.favorite } : b
        ),
      };
  }
}

export function useBookmarks(): UseBookmarksReturn {
  const [state, dispatch] = useReducer(bookmarkReducer, { bookmarks: [], nextId: 1 });
  return {
    bookmarks: state.bookmarks,
    addBookmark: (title, url) => dispatch({ type: 'ADD', title, url }),
    removeBookmark: (id) => dispatch({ type: 'REMOVE', id }),
    toggleFavorite: (id) => dispatch({ type: 'TOGGLE_FAVORITE', id }),
  };
}
```
`useReducer` を `import { useReducer } from 'react'` でインポートしてください。

---

## Exercise 02: UIコンポーネント

### レベル1（そっと後押し）
3つの独立したコンポーネントを作ります。各コンポーネントは props で関数を受け取るだけで、
自分でデータは管理しません。

- `BookmarkForm`: `useState` で入力値を管理。「追加」ボタンで `onAdd` を呼ぶ
- `BookmarkCard`: props で受け取ったデータを表示。ボタンクリックでコールバックを呼ぶ
- `BookmarkFilter`: 2つのボタン。クリックで `onFilterChange` を呼ぶ

### レベル2（もう少し具体的に）
`BookmarkForm`:
- `<label>` の `htmlFor` と `<input>` の `id` を一致させる（`getByLabelText` でテスト）
- 両方空でないときだけボタンを有効に: `disabled={!title || !url}`
- 追加後に `setTitle('')` と `setUrl('')` でクリア

`BookmarkCard`:
- お気に入りボタン: `aria-label="お気に入り"` を設定し、テキストは `favorite ? '★' : '☆'`
- 削除ボタン: テキストは「削除」

`BookmarkFilter`:
- 「すべて」ボタン → `onClick={() => onFilterChange('all')}`
- 「お気に入り」ボタン → `onClick={() => onFilterChange('favorites')}`

### レベル3（ほぼ答え）
```tsx
export function BookmarkForm(props: { onAdd: (title: string, url: string) => void }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    props.onAdd(title, url);
    setTitle('');
    setUrl('');
  };

  return (
    <div>
      <label htmlFor="title">タイトル</label>
      <input id="title" value={title} onChange={e => setTitle(e.target.value)} />
      <label htmlFor="url">URL</label>
      <input id="url" value={url} onChange={e => setUrl(e.target.value)} />
      <button onClick={handleSubmit} disabled={!title || !url}>追加</button>
    </div>
  );
}

export function BookmarkCard(props: {
  title: string; url: string; favorite: boolean;
  onToggleFavorite: () => void; onDelete: () => void;
}) {
  return (
    <div>
      <span>{props.title}</span>
      <span>{props.url}</span>
      <button aria-label="お気に入り" onClick={props.onToggleFavorite}>
        {props.favorite ? '★' : '☆'}
      </button>
      <button onClick={props.onDelete}>削除</button>
    </div>
  );
}

export function BookmarkFilter(props: {
  filter: 'all' | 'favorites';
  onFilterChange: (filter: 'all' | 'favorites') => void;
}) {
  return (
    <div>
      <button onClick={() => props.onFilterChange('all')}>すべて</button>
      <button onClick={() => props.onFilterChange('favorites')}>お気に入り</button>
    </div>
  );
}
```
`useState` を `import { useState } from 'react'` でインポートしてください。

---

## Exercise 03: 統合アプリ

### レベル1（そっと後押し）
Exercise 01 と 02 で作ったものを **組み合わせる** だけです！

- `useBookmarks` でデータ管理
- `useState` でフィルター状態を管理
- `BookmarkForm`, `BookmarkCard`, `BookmarkFilter` をレンダーする

### レベル2（もう少し具体的に）
```tsx
function BookmarkApp() {
  const { bookmarks, addBookmark, removeBookmark, toggleFavorite } = useBookmarks();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  // フィルタリング
  const filtered = filter === 'favorites'
    ? bookmarks.filter(b => b.favorite)
    : bookmarks;

  // BookmarkForm + BookmarkFilter + BookmarkCard の一覧 をレンダー
}
```

### レベル3（ほぼ答え）
```tsx
import { useState } from 'react';
import { useBookmarks } from './01-bookmark-model';
import { BookmarkForm, BookmarkCard, BookmarkFilter } from './02-bookmark-components';

export function BookmarkApp() {
  const { bookmarks, addBookmark, removeBookmark, toggleFavorite } = useBookmarks();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filtered = filter === 'favorites'
    ? bookmarks.filter(b => b.favorite)
    : bookmarks;

  return (
    <div>
      <BookmarkForm onAdd={addBookmark} />
      <BookmarkFilter filter={filter} onFilterChange={setFilter} />
      {filtered.map(bookmark => (
        <BookmarkCard
          key={bookmark.id}
          title={bookmark.title}
          url={bookmark.url}
          favorite={bookmark.favorite}
          onToggleFavorite={() => toggleFavorite(bookmark.id)}
          onDelete={() => removeBookmark(bookmark.id)}
        />
      ))}
    </div>
  );
}
```
Exercise 01 と 02 のファイルからインポートするのを忘れずに。
ここまでの全知識を使って完成させましょう！
