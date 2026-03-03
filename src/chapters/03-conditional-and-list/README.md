# Chapter 03: 条件分岐とリスト表示

## 条件によって表示を変える

Webアプリでは「ログインしている人にだけ表示する」「在庫がないときは違うメッセージを出す」など、**条件によって表示を切り替える** ことがよくあります。

### 信号機で考えてみよう

交差点の信号機を想像してください。

- **赤** → 「止まれ」が表示される
- **青** → 「進め」が表示される
- **黄** → 「注意」が表示される

信号の状態（条件）によって、表示される内容が変わりますよね。
Reactでも同じことを **条件分岐** で実現します。

---

## 三項演算子（condition ? A : B）

「もし〇〇なら A を表示、そうでなければ B を表示」というパターンには **三項演算子** を使います。

日本語で言うと: 「この条件、本当？ だったら A、嘘ならB」

```tsx
function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <p>
      {isLoggedIn ? 'ようこそ！' : 'ログインしてください'}
    </p>
  );
}
```

これは if/else と同じ意味です:

```tsx
// if/else で書くとこう（JSXの外で）
function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) {
    return <p>ようこそ！</p>;
  } else {
    return <p>ログインしてください</p>;
  }
}

// 三項演算子で書くとこう（JSXの中で）
function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <p>{isLoggedIn ? 'ようこそ！' : 'ログインしてください'}</p>
  );
}
```

どちらでも動きますが、三項演算子のほうが **コンパクト** に書けます。

---

## && 演算子（条件付き表示）

「条件が true のときだけ表示する（false のときは何も表示しない）」というパターンもよくあります。

```tsx
function Notification({ hasNewMessage }: { hasNewMessage: boolean }) {
  return (
    <div>
      <h1>ホーム</h1>
      {hasNewMessage && <p>新しいメッセージがあります！</p>}
    </div>
  );
}
```

`&&` の動き:
- 左側が `true` → 右側（JSX要素）が表示される
- 左側が `false` → 何も表示されない

「AND（かつ）」の意味を思い出してください。
「メッセージがある **かつ** この要素を表示する」→ メッセージがなければ何も出ない。

### 注意: 数値の0に気をつけよう

```tsx
// 危険！ count が 0 のとき「0」が画面に表示されてしまう
{count && <p>アイテムが {count} 個あります</p>}

// 安全: Boolean に変換する
{count > 0 && <p>アイテムが {count} 個あります</p>}
```

`0` は JavaScript で「falsy（偽っぽい値）」ですが、`&&` の左側が数値の場合、
React はその数値をそのまま表示してしまいます。
`count > 0` のように明示的に boolean にしましょう。

---

## 配列をリストに変換する: map()

「データの配列をもとに、リスト表示を作る」のは React で非常によくあるパターンです。

### 料理のレシピで考えてみよう

材料リストがあるとします:
```
['たまご', '牛乳', '砂糖']
```

これを画面に表示したい:
```
- たまご
- 牛乳
- 砂糖
```

JavaScript の `.map()` メソッドを使うと、**配列の各要素を別のものに変換** できます。

```tsx
function IngredientList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

`.map()` がやっていること:
1. 配列の **各要素** を1つずつ取り出す
2. それぞれを **JSX要素（`<li>`）** に変換する
3. 結果は **JSX要素の配列** になる
4. React がそれを画面に表示する

```
['たまご', '牛乳', '砂糖']
  ↓ map()
[<li>たまご</li>, <li>牛乳</li>, <li>砂糖</li>]
```

---

## なぜ key が必要なの？

`.map()` でリストを作るとき、各要素に `key` を付ける必要があります。

### 学生証番号で考えてみよう

30人のクラスを想像してください。
もし「名前だけ」で生徒を管理したら、同姓同名の「田中さん」がいたとき困りますよね。

だから **学生証番号（一意のID）** をつけて管理します。

Reactも同じです。リストの各要素に `key` をつけないと:
- どれが追加されたのか
- どれが削除されたのか
- どれが変更されたのか

を React が **効率的に判断できない** のです。

```tsx
// OK: 一意な key を設定
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}

// NG: key がない（Reactが警告を出す）
{items.map((item) => (
  <li>{item.name}</li>
))}

// 避けるべき: index を key にする（順番が変わると問題が起きる）
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}
```

**key のルール:**
1. リスト内で **一意** であること
2. **変わらない** 値であること（データのIDが最適）
3. 配列のインデックス（index）は **最後の手段**

---

## 空配列のハンドリング

配列が空のときの表示も忘れずに考えましょう。

```tsx
function TaskList({ tasks }: { tasks: string[] }) {
  if (tasks.length === 0) {
    return <p>タスクがありません</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task}>{task}</li>
      ))}
    </ul>
  );
}
```

「データがないとき」も立派なUIの状態です。
何も表示しないのではなく、「データがない」ことをユーザーに伝えましょう。

---

## オブジェクトの配列をリスト表示する

実際のアプリでは、文字列の配列よりも **オブジェクトの配列** を扱うことが多いです。

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong>
          <span>({user.email})</span>
        </li>
      ))}
    </ul>
  );
}
```

ポイント:
- `key` には `user.id` のような **一意な値** を使う
- 各オブジェクトの **プロパティ** に `user.name` のようにアクセスする

---

## この章の演習

| # | テーマ | 学ぶこと |
|---|--------|----------|
| 01 | 条件分岐 | 三項演算子と && 演算子 |
| 02 | リスト表示 | map() で配列をリストに変換 |
| 03 | オブジェクトのリスト | オブジェクト配列の表示と条件付きスタイル |

### 進め方

1. `exercises/` フォルダのファイルを開く
2. テストを実行する（最初は赤くなる）
3. テストが緑になるようにコードを書く
4. 全てのテストが緑になったら、なぜ動くのか考えてみよう

テスト実行コマンド:
```bash
npx vitest src/chapters/03-conditional-and-list
```

---

## まとめ

- **三項演算子** `? :` は「AかBか」の切り替え
- **&& 演算子** は「条件が true のときだけ表示」
- **`.map()`** で配列の各要素をJSX要素に変換
- **key** はリスト内の要素を一意に識別するためのID（学生証番号）
- **空配列** のときの表示も忘れない
