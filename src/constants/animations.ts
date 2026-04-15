/**
 * animations.ts
 * Framer Motion アニメーション定数
 * - shutterAnimation: 撮影ボタンクリック時の scale pulse
 * - resultCardAnimation: 結果カードのスライドイン
 * - staggerContainer: 子要素の順次表示
 * - loadingSpinAnimation: ローディングアイコンの回転
 */

import type { Variants } from 'framer-motion';

const SLIDE_OFFSET_Y = 40;
const STAGGER_DELAY = 0.15;
const SPIN_DURATION = 1;

export const shutterAnimation: Variants = {
  idle: { scale: 1 },
  tap: { scale: [1, 1.3, 1], transition: { duration: 0.3 } },
};

export const resultCardAnimation: Variants = {
  hidden: { opacity: 0, y: SLIDE_OFFSET_Y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_DELAY } },
};

export const loadingSpinAnimation: Variants = {
  spin: {
    rotate: 360,
    transition: { duration: SPIN_DURATION, repeat: Infinity, ease: 'linear' },
  },
};
