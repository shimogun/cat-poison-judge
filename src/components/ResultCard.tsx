/**
 * ResultCard.tsx
 * 判定結果カード
 * - 撮影画像を上部に表示
 * - 判定バッジがオーバーラップ
 * - 白背景のボディに食材名・理由ボックス
 * - 「もう一度撮る」ボタン
 */

import type { JudgmentResult, Safety } from '../types/judgment'

interface Props {
  result: JudgmentResult
  capturedImage: string
  onRetry: () => void
}

interface SafetyConfig {
  badgeClass: string
  badgeLabel: string
  reasonClass: string
  icon: string
}

const SAFETY_CONFIG: Record<Safety, SafetyConfig> = {
  safe: {
    badgeClass: 'bg-green text-white',
    badgeLabel: '✅ 食べても大丈夫！',
    reasonClass: 'bg-green-bg text-green-text',
    icon: '✅',
  },
  dangerous: {
    badgeClass: 'bg-red text-white',
    badgeLabel: '🚫 食べさせちゃダメ！',
    reasonClass: 'bg-red-bg text-red-text',
    icon: '🚫',
  },
  caution: {
    badgeClass: 'bg-orange text-white',
    badgeLabel: '⚠️ 要注意',
    reasonClass: 'bg-orange-bg text-orange-text',
    icon: '⚠️',
  },
  unknown: {
    badgeClass: 'bg-orange text-white',
    badgeLabel: '❓ 判定できません',
    reasonClass: 'bg-orange-bg text-orange-text',
    icon: '❓',
  },
}

export function ResultCard({ result, capturedImage, onRetry }: Props) {
  const config = SAFETY_CONFIG[result.safety]
  const imageUrl = `data:image/jpeg;base64,${capturedImage}`

  return (
    <div
      className="w-full rounded-[var(--radius)] overflow-hidden border-[1.5px] border-pink-light"
      style={{ animation: 'fadeUp 0.4s ease' }}
    >
      {/* 画像セクション */}
      <div className="relative h-[200px] overflow-hidden bg-pink-bg">
        <img
          src={imageUrl}
          alt={result.itemName}
          className="w-full h-full object-cover brightness-90"
        />
        <div
          className={`absolute -bottom-[18px] left-1/2 -translate-x-1/2
                      px-7 py-2.5 rounded-full text-[15px] font-bold
                      whitespace-nowrap flex items-center gap-1.5
                      shadow-[0_4px_16px_rgba(0,0,0,0.15)] z-[2]
                      ${config.badgeClass}`}
        >
          {config.badgeLabel}
        </div>
      </div>

      {/* ボディ */}
      <div className="pt-[30px] px-[18px] pb-5 bg-white">
        <h2 className="text-xl font-bold text-center mb-3.5 text-text">
          {result.itemName}
        </h2>

        <div
          className={`rounded-[var(--radius-sm)] px-4 py-3.5 text-sm leading-[1.7]
                      flex gap-2.5 items-start mb-4 ${config.reasonClass}`}
        >
          <span className="text-xl shrink-0">{config.icon}</span>
          <span>{result.reason}</span>
        </div>

        <button
          onClick={onRetry}
          className="w-full py-3.5 rounded-[var(--radius-sm)] border-[1.5px] border-pink-light
                     bg-white text-pink-deep text-sm font-bold cursor-pointer
                     hover:bg-pink-bg transition-colors"
        >
          📷 もう一度撮る
        </button>
      </div>
    </div>
  )
}
