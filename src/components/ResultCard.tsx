/**
 * ResultCard.tsx
 * 判定結果カード（アニメーション付き）
 * - safety の値に応じて背景色を切り替え（safe=緑, dangerous=赤, caution=オレンジ, unknown=グレー）
 * - resultCardAnimation でスライドイン表示
 * - 表示内容: 判定アイコン（✅/❌/⚠️/❓）+ itemName + reason + confidence
 */

import { motion } from 'framer-motion'
import type { JudgmentResult, Safety } from '../types/judgment'
import { resultCardAnimation, staggerContainer } from '../constants/animations'

interface Props {
  result: JudgmentResult
  onRetry: () => void
}

const SAFETY_ICON: Record<Safety, string> = {
  safe: '✅',
  dangerous: '❌',
  caution: '⚠️',
  unknown: '❓',
}

const SAFETY_LABEL: Record<Safety, string> = {
  safe: '安全',
  dangerous: '危険',
  caution: '要注意',
  unknown: '判定不能',
}

const SAFETY_BG: Record<Safety, string> = {
  safe: 'bg-accent',
  dangerous: 'bg-danger',
  caution: 'bg-caution',
  unknown: 'bg-gray-400',
}

const CONFIDENCE_LABEL: Record<JudgmentResult['confidence'], string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export function ResultCard({ result, onRetry }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto flex flex-col gap-4"
    >
      <motion.div
        variants={resultCardAnimation}
        className={`${SAFETY_BG[result.safety]} rounded-2xl p-6 text-white shadow-lg`}
      >
        <div className="text-center mb-4">
          <span className="text-5xl">{SAFETY_ICON[result.safety]}</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1">
          {result.itemName}
        </h2>

        <p className="text-center text-lg font-semibold mb-3">
          {SAFETY_LABEL[result.safety]}
        </p>

        <p className="text-center text-white/90 text-sm leading-relaxed">
          {result.reason}
        </p>

        <p className="text-center text-white/70 text-xs mt-3">
          確信度: {CONFIDENCE_LABEL[result.confidence]}
        </p>
      </motion.div>

      <motion.button
        variants={resultCardAnimation}
        onClick={onRetry}
        className="bg-primary text-white font-bold py-3 px-6 rounded-full shadow-md
                   active:shadow-sm transition-shadow"
      >
        🔄 もう一度判定する
      </motion.button>
    </motion.div>
  )
}
