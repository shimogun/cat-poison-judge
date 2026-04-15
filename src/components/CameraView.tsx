/**
 * CameraView.tsx
 * カメラ映像のライブプレビューと撮影ボタン
 * - ダークテーマのカメラUI
 * - フォーカスマーク（コーナーブラケット + 中央パルス）
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
  facingMode,
  onFlipCamera,
  recentImageUrl,
  recentSafetyColor,
  onShowRecent,
}: Props) {
  const modeLabel = facingMode === 'environment' ? '📷 アウトカメラ' : '🤳 インカメラ'

  return (
    <div className="flex flex-col bg-[#111] flex-1 sm:flex-none">
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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white/75 text-xs px-4 py-1.5 rounded-full backdrop-blur-sm z-10 whitespace-nowrap">
          🍖 食べ物をフレームに入れてね
        </div>

        {/* カメラモードバッジ（モバイルのみ） */}
        <div className="absolute top-4 right-4 bg-pink/25 border border-pink/40 text-pink text-[11px] px-2.5 py-1 rounded-full z-10 sm:hidden">
          {modeLabel}
        </div>

        {/* フォーカスマーク */}
        <div className="relative w-[180px] h-[180px] z-[5]">
          <div className="focus-corner tl" />
          <div className="focus-corner tr" />
          <div className="focus-corner bl" />
          <div className="focus-corner br" />
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-pink/70"
            style={{ animation: 'focus-pulse 2s ease-in-out infinite' }}
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[11px] whitespace-nowrap">
            ここに食べ物を
          </div>
        </div>
      </div>

      {/* 下部コントロールバー */}
      <div className="bg-[#111] px-7 pt-4 pb-7 flex items-center justify-between shrink-0">
        {/* 左: 撮影履歴サムネ */}
        <div className="w-[54px] flex flex-col items-center gap-1.5">
          <button
            onClick={onShowRecent}
            disabled={!recentImageUrl}
            className="w-[52px] h-[52px] rounded-[12px] border-2 border-white/20 bg-[#2a2a2a]
                       overflow-hidden flex items-center justify-center text-[22px]
                       cursor-pointer hover:border-pink transition-colors relative
                       disabled:cursor-default disabled:hover:border-white/20"
          >
            {recentImageUrl ? (
              <>
                <img src={recentImageUrl} alt="最近" className="w-full h-full object-cover" />
                {recentSafetyColor && (
                  <div
                    className={`absolute bottom-[3px] right-[3px] w-2 h-2 rounded-full border-[1.5px] border-[#111] ${recentSafetyColor}`}
                  />
                )}
              </>
            ) : (
              '🍽️'
            )}
          </button>
          <span className="text-[10px] text-white/40">最近</span>
        </div>

        {/* 中央: シャッターボタン */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onCapture}
            disabled={disabled}
            className="w-[76px] h-[76px] rounded-full bg-pink border-4 border-white/25
                       flex items-center justify-center cursor-pointer
                       shadow-[0_0_0_8px_rgba(255,123,172,0.18)]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:scale-[0.96] transition-transform"
            aria-label="撮影"
          >
            <div className="w-[30px] h-[30px] rounded-full bg-white opacity-90" />
          </motion.button>
          <span className="text-[10px] text-white/40">タップして判定</span>
        </div>

        {/* 右: カメラ切り替え（モバイルのみ） */}
        <div className="w-[54px] flex flex-col items-center gap-1.5 sm:invisible">
          <button
            onClick={onFlipCamera}
            className="w-[52px] h-[52px] rounded-full bg-white/10 border-2 border-white/20
                       flex items-center justify-center cursor-pointer
                       hover:bg-white/[0.18] hover:border-white/40 transition-all
                       active:scale-[0.94]"
          >
            <span className="text-[22px]">🔄</span>
          </button>
          <span className="text-[10px] text-white/40">切り替え</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
