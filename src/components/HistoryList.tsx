/**
 * HistoryList.tsx
 * 最近チェックした食材の履歴リスト
 * - サムネイル + 食材名 + 時刻 + 判定ドット
 */

import type { Safety } from '../types/judgment'

export interface HistoryItem {
  itemName: string
  safety: Safety
  time: string
  imageUrl: string
}

interface Props {
  items: HistoryItem[]
}

const DOT_COLOR: Record<Safety, string> = {
  safe: 'bg-green',
  dangerous: 'bg-red',
  caution: 'bg-orange',
  unknown: 'bg-orange',
}

export function HistoryList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-text-muted text-[13px] bg-pink-bg rounded-[var(--radius)]">
        まだ履歴がありません
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <div
          key={`${item.itemName}-${item.time}-${index}`}
          className="flex items-center gap-3 py-3 px-1 border-b border-black/[0.06] last:border-b-0"
        >
          <div className="w-[46px] h-[46px] rounded-[12px] bg-pink-bg overflow-hidden shrink-0">
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text truncate">
              {item.itemName}
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">{item.time}</div>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_COLOR[item.safety]}`} />
        </div>
      ))}
    </div>
  )
}
