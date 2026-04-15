/**
 * LoadingOverlay.tsx
 * 分析中オーバーレイ
 * - カメラ映像の上に半透明オーバーレイを表示
 * - 肉球アイコン（🐾）が loadingSpinAnimation で回転
 * - 「判定中...」テキスト表示
 */

import { motion } from 'framer-motion'
import { loadingSpinAnimation } from '../constants/animations'

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center gap-4 z-10">
      <motion.div
        variants={loadingSpinAnimation}
        animate="spin"
        className="text-5xl"
      >
        🐾
      </motion.div>
      <p className="text-white text-lg font-bold">判定中...</p>
    </div>
  )
}
