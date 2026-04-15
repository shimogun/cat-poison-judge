/**
 * CameraView.tsx
 * カメラ映像のライブプレビューと撮影ボタン
 * - ダークテーマのカメラUI
 * - ゴールドのフォーカスマーク
 * - ヒントテキスト
 * - 下部コントロールバー（履歴サムネ / シャッター / カメラ切替）
 */

import { motion } from 'framer-motion'
import type { FacingMode } from '../hooks/useCamera'

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onCapture: () => void
  disabled: boolean
  facingMode: FacingMode
  onFlipCamera: () => void
  recentImageUrl: string | null
  recentSafetyColor: string | null
  onShowRecent: () => void
}

export function CameraView({
  videoRef,
  canvasRef,
  onCapture,
  disabled,
  onFlipCamera,
  recentImageUrl,
  recentSafetyColor,
  onShowRecent,
}: Props) {


  return (
    <div className="flex flex-col bg-gold flex-1 sm:flex-none">
      {/* ビューファインダー */}
      <div className="relative flex-1 sm:flex-none sm:aspect-[4/3] flex items-center justify-center overflow-hidden min-h-[50vh] sm:min-h-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* ヒントテキスト */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-gold-light text-xs px-4 py-1.5 rounded-full backdrop-blur-sm z-10 whitespace-nowrap">
          🍖 食べ物をフレームに入れてね
        </div>

        {/* フォーカスマーク */}
        <div className="relative w-[180px] h-[180px] z-[5]">
          <div className="focus-corner tl" />
          <div className="focus-corner tr" />
          <div className="focus-corner bl" />
          <div className="focus-corner br" />
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gold/70"
            style={{ animation: 'focus-pulse 2s ease-in-out infinite' }}
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-smoke/60 text-[11px] whitespace-nowrap">
            ここに食べ物を
          </div>
        </div>
      </div>

      {/* 下部コントロールバー */}
      <div className="bg-gold px-7 pt-4 pb-7 flex items-center justify-between shrink-0">
        {/* 左: 撮影履歴サムネ */}
        <div className="w-[54px] flex flex-col items-center gap-1.5">
          <button
            onClick={onShowRecent}
            disabled={!recentImageUrl}
            className="w-[52px] h-[52px] rounded-[12px] border-2 border-charcoal/30 bg-charcoal/20
                       overflow-hidden flex items-center justify-center text-[22px]
                       cursor-pointer hover:border-gold transition-colors relative
                       disabled:cursor-default disabled:hover:border-charcoal/30"
          >
            {recentImageUrl ? (
              <>
                <img src={recentImageUrl} alt="最近" className="w-full h-full object-cover" />
                {recentSafetyColor && (
                  <div
                    className={`absolute bottom-[3px] right-[3px] w-2 h-2 rounded-full border-[1.5px] border-gold-deep ${recentSafetyColor}`}
                  />
                )}
              </>
            ) : (
              '🍽️'
            )}
          </button>
          <span className="text-[10px] text-charcoal/50">最近</span>
        </div>

        {/* 中央: シャッターボタン */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onCapture}
            disabled={disabled}
            className="w-[76px] h-[76px] rounded-full bg-charcoal border-4 border-charcoal-light/50
                       flex items-center justify-center cursor-pointer
                       shadow-[0_0_0_8px_rgba(44,44,46,0.25)]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:scale-[0.96] transition-transform"
            aria-label="撮影"
          >
            <div className="w-[30px] h-[30px] rounded-full bg-warm-white opacity-90" />
          </motion.button>
          <span className="text-[10px] text-charcoal/50">タップして判定</span>
        </div>

        {/* 右: カメラ切り替え（モバイルのみ） */}
        <div className="w-[54px] flex flex-col items-center gap-1.5 sm:invisible">
          <button
            onClick={onFlipCamera}
            className="w-[52px] h-[52px] rounded-full bg-charcoal/15 border-2 border-charcoal/25
                       flex items-center justify-center cursor-pointer
                       hover:bg-charcoal/25 hover:border-charcoal/40 transition-all
                       active:scale-[0.94]"
          >
            <span className="text-[22px]">🔄</span>
          </button>
          <span className="text-[10px] text-charcoal/50">切り替え</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
