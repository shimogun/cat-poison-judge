# SKILL.md — コーディング品質基準

## 言語・環境
- TypeScript strict mode（tsconfig に `"strict": true`）
- React 18 + Vite 5
- Node.js 18以上

---

## 命名規則
| 対象 | ルール | 例 |
|------|--------|-----|
| コンポーネント | PascalCase | `ResultCard.tsx` |
| フック | camelCase + use prefix | `useCamera.ts` |
| 型・インターフェース | PascalCase | `JudgmentResult` |
| 定数（スカラー） | UPPER_SNAKE_CASE | `MAX_IMAGE_SIZE` |
| 定数（オブジェクト） | camelCase | `resultCardAnimation` |
| イベントハンドラ | handle prefix | `handleCapture` |

---

## コード品質基準
- 1関数50行以内
- 1コンポーネント = 1つの関心事（単一責任）
- マジックナンバー・マジック文字列禁止（定数化）
- `any` 型禁止。`unknown` + 型ガードを使う
- オプショナルチェーン（`?.`）を積極的に使う
- 非同期処理は必ず `async/await`（Promiseチェーン禁止）

---

## React ルール
- Props は必ず型定義する（`interface Props` or `type Props`）
- `useEffect` の依存配列を省略しない
- `useEffect` 内の非同期処理は内部に async 関数を定義する
- 副作用ロジック（カメラ・API）はカスタムフックに分離
- コンポーネントに直接 API 呼び出しを書かない

---

## エラー処理
- `try/catch` で捕捉したエラーは必ず state に格納してUIに反映
- `console.log` のみの処理禁止
- ユーザー向けエラーメッセージは日本語
- カメラエラーは種別ごとに分岐:
  - `NotAllowedError` → 「カメラの使用を許可してください」
  - `NotFoundError` → 「カメラが見つかりません」
  - その他 → 「カメラの起動に失敗しました」

---

## Framer Motion ルール
- アニメーション値はコンポーネント外の定数として定義（`animations.ts`）
- `AnimatePresence` を使う場合は必ず `key` を設定
- `layout` prop はレイアウトシフトを引き起こす場合のみ使用

---

## Claude Vision API ルール
- モデル名: `claude-haiku-4-5-20251001`（ハードコード禁止 → 定数化）
- APIキーは `import.meta.env.VITE_ANTHROPIC_API_KEY` から取得
- `max_tokens: 300`（固定）
- レスポンスは必ず JSON.parse を try/catch で囲む
- パース失敗時は `{ safety: 'unknown', ... }` を返す（例外を投げない）

---

## ファイルサイズ目安
| ファイル | 目安行数 |
|---------|---------|
| コンポーネント | 〜80行 |
| カスタムフック | 〜60行 |
| 定数ファイル | 〜40行 |
| App.tsx | 〜80行 |

---

## UIスタイリングルール（UI/UX改善フェーズ追加）

### Tailwind 使用ルール
- インラインstyle属性禁止（Tailwindクラスで表現できる場合）
- 任意値（`w-[123px]`）は CSS変数経由のみ許可（`w-[var(--xxx)]`）
- クラス順序: レイアウト → サイズ → 色 → タイポグラフィ → アニメーション

### Framer Motion ルール（追加）
- アニメーション定数は必ず `animations.ts` に定義（コンポーネント内にインライン定義しない）
- `whileHover` / `whileTap` はインタラクティブ要素（ボタン・カード）にのみ使用
- `AnimatePresence` の `mode` は明示する（`"wait"` or `"sync"`）

### レスポンシブルール
- SPファーストで記述（`sm:` で上書き）
- タップ領域の最小サイズ: `min-w-[44px] min-h-[44px]`
- フォントサイズの最小値: `text-sm`（12px未満禁止）