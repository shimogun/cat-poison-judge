/**
 * LoadingOverlay.tsx
 * 分析中オーバーレイ
 * - カメラ映像の上に半透明オーバーレイを表示
 * - 肉球アイコン（🐾）が loadingBounceAnimation で上下バウンス
 * - 「判定中...」テキスト表示
 */

import { motion } from 'framer-motion'
import { loadingBounceAnimation } from '../constants/animations'

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-black/40 rounded-[var(--radius-card)] flex flex-col items-center justify-center gap-4 z-10">
      <motion.div
        animate={loadingBounceAnimation.animate}
        transition={loadingBounceAnimation.transition}
        className="text-6xl"
      >
        🐾
      </motion.div>
      <p className="text-white font-[family-name:var(--font-display)] font-bold text-lg">判定中...</p>
    </div>
  )
}
