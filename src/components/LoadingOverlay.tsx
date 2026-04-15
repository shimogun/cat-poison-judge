/**
 * LoadingOverlay.tsx
 * 分析中オーバーレイ
 * - スキャンライン（ピンクグラデーション）
 * - 「AIが判定中...」テキスト
 * - バウンスドット3つ
 */

const DOT_DELAYS = [0, 0.2, 0.4]

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-black/45 flex items-center justify-center flex-col gap-2.5 z-10">
      <div
        className="absolute left-0 right-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #FF7BAC, transparent)',
          animation: 'scandown 1.5s linear infinite',
        }}
      />

      <p className="text-white text-sm font-medium">🔍 AIが判定中...</p>

      <div className="flex gap-1.5">
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full bg-pink inline-block"
            style={{ animation: `bounce-dot 1.2s infinite ease-in-out ${delay}s` }}
          />
        ))}
      </div>
    </div>
  )
}
