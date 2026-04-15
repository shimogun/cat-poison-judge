# SKILL.md — UIスタイリングルール追記分
# 既存の SKILL.md 末尾にこのセクションをコピペしてください

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
