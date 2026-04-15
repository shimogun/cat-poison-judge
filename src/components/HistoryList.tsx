/**
 * HistoryList.tsx
 * 最近チェックした食材の履歴リスト
 * - サムネイル + 食材名 + 時刻 + 判定ドット
 * - タップで判定結果を再表示
 */

import type { JudgmentResult, Safety } from '../types/judgment'

export interface HistoryItem {
  result: JudgmentResult
  time: string
  imageUrl: string
  capturedImage: string
}

interface Props {
  items: HistoryItem[]
  onItemClick: (item: HistoryItem) => void
}

const DOT_COLOR: Record<Safety, string> = {
  safe: 'bg-safe',
  dangerous: 'bg-danger',
  caution: 'bg-gold',
  unknown: 'bg-smoke',
}

export function HistoryList({ items, onItemClick }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-smoke text-[13px] bg-charcoal-light rounded-[var(--radius)]">
        まだ履歴がありません
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <button
          key={`${item.result.itemName}-${item.time}-${index}`}
          onClick={() => onItemClick(item)}
          className="flex items-center gap-3 py-3 px-1 border-b border-white/[0.06] last:border-b-0
                     cursor-pointer hover:bg-white/[0.04] transition-colors text-left w-full"
        >
          <div className="w-[46px] h-[46px] rounded-[12px] bg-charcoal-light overflow-hidden shrink-0">
            <img
              src={item.imageUrl}
              alt={item.result.itemName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-warm-white truncate">
              {item.result.itemName}
            </div>
            <div className="text-[11px] text-smoke mt-0.5">{item.time}</div>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_COLOR[item.result.safety]}`} />
        </button>
      ))}
    </div>
  )
}
