import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { AppState } from './types/judgment'
import { useCamera } from './hooks/useCamera'
import { useVisionJudge } from './hooks/useVisionJudge'
import { Header } from './components/Header'
import { CameraView } from './components/CameraView'
import { LoadingOverlay } from './components/LoadingOverlay'
import { ResultCard } from './components/ResultCard'
import { HistoryList } from './components/HistoryList'
import type { HistoryItem } from './components/HistoryList'

const MAX_HISTORY = 10

const SAFETY_DOT_COLOR: Record<string, string> = {
  safe: 'bg-green',
  dangerous: 'bg-red',
  caution: 'bg-orange',
  unknown: 'bg-orange',
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `今日 ${h}:${m}`
}

function App() {
  const [appState, setAppState] = useState<AppState>('idle')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const { videoRef, canvasRef, captureImage, error: cameraError, isReady, flipCamera, facingMode } = useCamera()
  const { result, isLoading, error: apiError, judge } = useVisionJudge()

  const handleCapture = useCallback(async () => {
    setAppState('capturing')
    const base64 = captureImage()
    if (!base64) {
      setAppState('error')
      return
    }

    setCapturedImage(base64)
    setAppState('analyzing')
    const judgment = await judge(base64)

    if (judgment) {
      setHistory((prev) =>
        [
          {
            itemName: judgment.itemName,
            safety: judgment.safety,
            time: formatTime(new Date()),
            imageUrl: `data:image/jpeg;base64,${base64}`,
          },
          ...prev,
        ].slice(0, MAX_HISTORY),
      )
      setAppState('result')
    } else {
      setAppState('error')
    }
  }, [captureImage, judge])

  const handleRetry = useCallback(() => {
    setAppState('idle')
  }, [])

  const handleShowRecent = useCallback(() => {
    if (result && capturedImage) {
      setAppState('result')
    }
  }, [result, capturedImage])

  const displayError = cameraError ?? apiError
  const showResult = appState === 'result' && result && capturedImage
  const showError = appState === 'error'

  const latestHistory = history.length > 0 ? history[0] : null

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ヘッダー: 常に全幅 */}
      <Header />

      {/* エラー表示 */}
      {displayError && appState !== 'analyzing' && (
        <div className="mx-auto w-full max-w-[480px] sm:max-w-[640px] px-4 mt-3">
          <div className="bg-red-bg border border-red text-red-text rounded-[var(--radius-sm)] px-4 py-3 text-center text-sm">
            {displayError}
          </div>
        </div>
      )}

      {/* カメラ画面 */}
      <div className={`flex flex-col flex-1 sm:flex-none sm:mx-auto sm:w-full sm:max-w-[640px] sm:p-5 ${showResult || showError ? 'hidden' : ''}`}>
        <div className="relative flex-1 sm:flex-none flex flex-col sm:rounded-[var(--radius)] sm:overflow-hidden sm:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            onCapture={handleCapture}
            disabled={!isReady || isLoading}
            facingMode={facingMode}
            onFlipCamera={flipCamera}
            recentImageUrl={latestHistory?.imageUrl ?? null}
            recentSafetyColor={latestHistory ? SAFETY_DOT_COLOR[latestHistory.safety] : null}
            onShowRecent={handleShowRecent}
          />
          <AnimatePresence>
            {appState === 'analyzing' && <LoadingOverlay />}
          </AnimatePresence>
        </div>
      </div>

      {/* 結果画面 */}
      {showResult && (
        <div className="mx-auto w-full max-w-[480px] sm:max-w-[640px] px-4 sm:px-5 pb-10 pt-4 flex flex-col gap-5">
          <ResultCard
            result={result}
            capturedImage={capturedImage}
            onRetry={handleRetry}
          />

          {history.length > 0 && (
            <div>
              <div className="text-sm font-bold text-text-muted mb-3 pl-1">
                🕘 最近チェックした食材
              </div>
              <HistoryList items={history} />
            </div>
          )}
        </div>
      )}

      {/* エラー画面 */}
      {showError && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <p className="text-red font-bold text-center">
            エラーが発生しました。もう一度お試しください。
          </p>
          <button
            onClick={handleRetry}
            className="w-full max-w-xs py-3.5 rounded-[var(--radius-sm)] border-[1.5px] border-pink-light
                       bg-white text-pink-deep text-sm font-bold cursor-pointer
                       hover:bg-pink-bg transition-colors"
          >
            📷 もう一度撮る
          </button>
        </div>
      )}
    </div>
  )
}

export default App
