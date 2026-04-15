/**
 * animations.ts
 * Framer Motion アニメーション定数
 * - shutterAnimation: 撮影ボタンタップ時の spring フィードバック
 * - resultCardAnimation: 結果カードのスライドイン + フェード
 * - iconPopAnimation: 判定アイコンのポップイン
 * - loadingBounceAnimation: ローディング肉球の上下バウンス
 * - staggerContainer: 子要素の順次表示
 */

import type { Variants } from 'framer-motion'

const STAGGER_DELAY = 0.15

/** 撮影ボタン: タップ時の spring フィードバック */
export const shutterAnimation: Variants = {
  idle: { scale: 1, rotate: 0 },
  tap: {
    scale: 0.85,
    rotate: -5,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
}

/** 結果カード: 下からスライドイン + フェード */
export const resultCardAnimation: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
}

/** 判定アイコン: ポップイン */
export const iconPopAnimation = {
  initial: { scale: 0, rotate: -20 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring' as const, stiffness: 500, damping: 20, delay: 0.15 },
}

/** ローディング肉球: 上下バウンス */
export const loadingBounceAnimation = {
  animate: { y: [0, -16, 0] },
  transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
}

/** 子要素の順次表示 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_DELAY } },
}
