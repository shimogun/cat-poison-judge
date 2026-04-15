/**
 * CameraView.tsx
 * カメラ映像のライブプレビューと撮影ボタン
 * - video タグでカメラ映像を表示
 * - 撮影ボタン: 丸型・ピンク背景・カメラアイコン
 * - クリック時に shutterAnimation で pulse エフェクト
 */

import { motion } from 'framer-motion'
import { shutterAnimation } from '../constants/animations'

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onCapture: () => void
  disabled: boolean
}

export function CameraView({ videoRef, canvasRef, onCapture, disabled }: Props) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-full aspect-[3/4] rounded-[var(--radius-card)] overflow-hidden bg-black shadow-[var(--shadow-card)]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        <motion.button
          variants={shutterAnimation}
          initial="idle"
          whileTap="tap"
          onClick={onCapture}
          disabled={disabled}
          className="absolute bottom-8 left-1/2 -translate-x-1/2
                     w-20 h-20 rounded-full bg-secondary text-white text-3xl shadow-lg
                     flex items-center justify-center
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:shadow-md transition-shadow"
          aria-label="撮影"
        >
          📷
        </motion.button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
