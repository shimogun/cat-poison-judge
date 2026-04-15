# CLAUDE_UI.md — 猫ごはん判定アプリ UI/UX改善指示書

## 前提
基本機能（STEP 0〜6）は実装済み。
本指示書はUI/UX改善フェーズ専用。既存ロジックには触れない。

## 改善スコープ
1. デザイントークンの見直し（色・フォント・間隔）
2. コンポーネント単位のビジュアル整備
3. アニメーション・マイクロインタラクションの強化

---

## STEP UI-0：現状監査
以下を確認してオーナーに報告する（実装は一切しない）:
- 各コンポーネントのスクリーンショット（またはコード確認）
- 現在のデザイントークン（tailwind.config.js の colors）
- animations.ts の定義内容
- SP表示での崩れ・余白の問題箇所
完了後、改善箇所リストをMarkdownテーブルで報告する。

> ⚠️ 承認ポイントUI-①：改善箇所リスト確認後に次へ進む

---

## STEP UI-1：デザイントークン更新

### tailwind.config.js の theme.extend.colors を以下に更新
```js
colors: {
  primary:   '#F5C842', // メインイエロー（変更なし）
  secondary: '#FF6B9D', // ピンク（変更なし）
  accent:    '#4CAF50', // グリーン（変更なし）
  danger:    '#FF4444', // レッド（変更なし）
  caution:   '#FF9800', // オレンジ（変更なし）
  bg:        '#FFF9E6', // クリームホワイト（変更なし）
  // 追加トークン
  'bg-card':   '#FFFFFF',
  'text-main': '#2D2D2D',
  'text-sub':  '#6B6B6B',
  'border':    '#E8E0D0',
  'surface':   '#FFF3CD',
}
```

### index.css に追加するフォント・間隔設定
```css
:root {
  --radius-card: 1.25rem;   /* カード角丸 */
  --radius-btn:  9999px;    /* ボタン角丸（pill） */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.08);
  --font-display: 'Zen Maru Gothic', 'Rounded Mplus 1c', sans-serif;
}
```

### Google Fonts 追加（index.html の <head>）
```html
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&display=swap" rel="stylesheet">
```

禁止: 既存カラー定数の削除・リネーム（参照箇所が壊れる）

---

## STEP UI-2：コンポーネント単位のビジュアル整備

### Header.tsx
- 背景: `bg-primary` + 下部に `border-b border-border`
- タイトルフォント: `font-display font-bold text-2xl`
- 猫アイコンに `animate-bounce` を追加（CSSクラス、Framer Motionは不要）
- 高さ: `h-14` 固定

### CameraView.tsx
- video タグのコンテナ: `rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)]`
- 撮影ボタンのサイズ: `w-20 h-20`（現状より大きく・タップ領域確保）
- ボタン位置: 画面下部から `pb-8` の固定位置（`absolute bottom-8`）
- ボタン内アイコン: サイズ `text-3xl`

### ResultCard.tsx
- カード全体: `rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6`
- 判定アイコン: `text-5xl` に拡大
- itemName: `font-display font-bold text-xl`
- reason: `text-text-sub text-sm leading-relaxed`
- confidence バッジ: `text-xs px-2 py-0.5 rounded-full bg-surface`

### LoadingOverlay.tsx
- 肉球アイコン: `text-6xl`（現状より大きく）
- 背景: `backdrop-blur-sm bg-black/40`（ブラー追加）
- テキスト: `text-white font-display font-bold text-lg`

---

## STEP UI-3：アニメーション強化

### src/constants/animations.ts を以下に更新

```typescript
// 撮影ボタン: タップ時のフィードバック強化
export const shutterAnimation = {
  whileTap: { scale: 0.85, rotate: -5 },
  transition: { type: 'spring', stiffness: 400, damping: 15 },
}

// 結果カード: 下からスライドイン + フェード
export const resultCardAnimation = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 40 },
  transition: { type: 'spring', stiffness: 300, damping: 25 },
}

// 判定アイコン: 結果表示時にポップイン（新規追加）
export const iconPopAnimation = {
  initial: { scale: 0, rotate: -20 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring', stiffness: 500, damping: 20, delay: 0.15 },
}

// ローディング肉球: 上下バウンス（回転から変更）
export const loadingBounceAnimation = {
  animate: { y: [0, -16, 0] },
  transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
}

// staggerContainer: 変更なし（既存を維持）
```

変更点の明示:
- `loadingSpinAnimation` → `loadingBounceAnimation` にリネーム
- `iconPopAnimation` を新規追加
- LoadingOverlay.tsx 内の参照名を `loadingBounceAnimation` に更新すること

---

## STEP UI-4：レスポンシブ対応

### ブレークポイント方針
- 基本: SP（375px〜）ファースト
- `sm:` (640px〜) でPC用の余白・フォントサイズを拡張

### 各コンポーネントの対応
```
CameraView: max-w-lg mx-auto（PC時に横幅制限）
ResultCard: max-w-lg mx-auto px-4（PC時に中央寄せ）
Header:     px-4 sm:px-8
```

### App.tsx のルートコンテナ
```tsx
<div className="min-h-screen bg-bg flex flex-col items-center">
  <div className="w-full max-w-lg flex flex-col flex-1">
    {/* コンテンツ */}
  </div>
</div>
```

---

## STEP UI-5：目視確認・品質チェック
以下を確認してオーナーに報告する:
- SP（375px）/ PC（1280px）での表示崩れなし
- 撮影ボタンのタップ領域が `44px × 44px` 以上
- 全アニメーションが60fps（DevToolsのPerformanceで確認）
- TypeScriptエラー0件（`npm run build` で確認）

> ⚠️ 承認ポイントUI-②：目視確認レポート確認後に完了とする

---

## 禁止事項
- 既存のロジックファイル（useCamera.ts・useVisionJudge.ts）を変更しない
- 既存の型定義（judgment.ts）を変更しない
- 指示にないコンポーネントの追加・削除をしない
- `loadingSpinAnimation` 参照箇所の更新漏れを残さない
- 承認なしに次のSTEPへ進まない
