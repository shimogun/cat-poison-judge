/**
 * ResultCard.tsx
 * 判定結果カード
 * - 撮影画像を上部に表示
 * - 判定バッジがオーバーラップ
 * - 胸毛ホワイト背景のボディに食材名・理由ボックス
 * - 「もう一度撮る」ボタン
 */

import { useCallback } from 'react'
import type { JudgmentResult, Safety } from '../types/judgment'

interface Props {
  result: JudgmentResult
  capturedImage: string
  onRetry: () => void
}

const SAFETY_SHARE_LABEL: Record<Safety, string> = {
  safe: '安全',
  dangerous: '危険',
  caution: '要注意',
  unknown: '判定不能',
}

interface SafetyConfig {
  badgeClass: string
  badgeLabel: string
  reasonClass: string
  icon: string
}

const SAFETY_CONFIG: Record<Safety, SafetyConfig> = {
  safe: {
    badgeClass: 'bg-safe text-white',
    badgeLabel: '✅ 食べても大丈夫！',
    reasonClass: 'bg-safe-bg text-safe-text',
    icon: '✅',
  },
  dangerous: {
    badgeClass: 'bg-danger text-white',
    badgeLabel: '🚫 食べさせちゃダメ！',
    reasonClass: 'bg-danger-bg text-danger-text',
    icon: '🚫',
  },
  caution: {
    badgeClass: 'bg-caution text-caution-text',
    badgeLabel: '⚠️ 要注意',
    reasonClass: 'bg-warm-white text-caution-text',
    icon: '⚠️',
  },
  unknown: {
    badgeClass: 'bg-smoke text-white',
    badgeLabel: '❓ 判定できません',
    reasonClass: 'bg-smoke-bg text-smoke',
    icon: '❓',
  },
}

export function ResultCard({ result, capturedImage, onRetry }: Props) {
  const config = SAFETY_CONFIG[result.safety]
  const imageUrl = `data:image/jpeg;base64,${capturedImage}`

  const handleShare = useCallback(async () => {
    const text = `🐱 ねこごはん判定器の結果\n\n${result.itemName}は猫にとって【${SAFETY_SHARE_LABEL[result.safety]}】\n${result.reason}\n\n`
    const url = window.location.origin

    if (navigator.share) {
      try {
        await navigator.share({ title: '🐱 ねこごはん判定器', text, url })
      } catch {
        // ユーザーがキャンセルした場合は何もしない
      }
    } else {
      try {
        await navigator.clipboard.writeText(text + url)
        alert('結果をコピーしました！')
      } catch {
        // フォールバック不要
      }
    }
  }, [result])

  return (
    <div
      className="w-full rounded-[var(--radius)] overflow-hidden border border-charcoal-light"
      style={{ animation: 'fadeUp 0.4s ease' }}
    >
      {/* 画像セクション */}
      <div className="relative h-[220px] overflow-hidden bg-charcoal">
        <img
          src={imageUrl}
          alt={result.itemName}
          className="w-full h-full object-cover brightness-90"
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12
                      px-6 py-2 text-[15px] font-bold
                      whitespace-nowrap flex items-center gap-1.5
                      shadow-[0_4px_20px_rgba(0,0,0,0.35)] z-[2]
                      border-2 border-white/30
                      ${config.badgeClass}`}
        >
          {config.badgeLabel}
        </div>
      </div>

      {/* ボディ */}
      <div className="pt-4 px-3.5 pb-3 bg-warm-white">
        <h2 className="text-base font-bold text-center mb-2 text-charcoal-deep">
          {result.itemName}
        </h2>

        <div
          className={`rounded-[var(--radius-sm)] px-3 py-2 text-xs leading-[1.6]
                      flex gap-2 items-start mb-2.5 ${config.reasonClass}`}
        >
          <span className="text-base shrink-0">{config.icon}</span>
          <span>{result.reason}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRetry}
            className="flex-1 py-2.5 rounded-[var(--radius-sm)] border-[1.5px] border-charcoal-light
                       bg-warm-white text-charcoal text-xs font-bold cursor-pointer
                       hover:bg-warm-white-deep transition-colors"
          >
            📷 もう一度撮る
          </button>
          <button
            onClick={handleShare}
            className="py-2.5 px-4 rounded-[var(--radius-sm)] border-[1.5px] border-gold
                       bg-gold text-charcoal-deep text-xs font-bold cursor-pointer
                       hover:bg-gold-deep hover:text-warm-white transition-colors"
          >
            📤 シェア
          </button>
        </div>
      </div>
    </div>
  )
}
