import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { AppState } from './types/judgment'
import { useCamera } from './hooks/useCamera'
import { useVisionJudge } from './hooks/useVisionJudge'
import { Header } from './components/Header'
import { CameraView } from './components/CameraView'
import { LoadingOverlay } from './components/LoadingOverlay'
import { ResultCard } from './components/ResultCard'

function App() {
  const [appState, setAppState] = useState<AppState>('idle')
  const { videoRef, canvasRef, captureImage, error: cameraError, isReady } = useCamera()
  const { result, isLoading, error: apiError, judge } = useVisionJudge()

  const handleCapture = useCallback(async () => {
    setAppState('capturing')
    const base64 = captureImage()
    if (!base64) {
      setAppState('error')
      return
    }

    setAppState('analyzing')
    await judge(base64)
    setAppState('result')
  }, [captureImage, judge])

  const handleRetry = useCallback(() => {
    setAppState('idle')
  }, [])

  const displayError = cameraError ?? apiError
  const showResult = appState === 'result' && result
  const showError = appState === 'error'

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center">
      <div className="w-full max-w-lg flex flex-col flex-1">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
          {displayError && appState !== 'analyzing' && (
            <div className="bg-danger/10 border border-danger text-danger rounded-xl px-4 py-3 w-full text-center text-sm">
              {displayError}
            </div>
          )}

          <div className={`relative w-full ${showResult || showError ? 'hidden' : ''}`}>
            <CameraView
              videoRef={videoRef}
              canvasRef={canvasRef}
              onCapture={handleCapture}
              disabled={!isReady || isLoading}
            />
            <AnimatePresence>
              {appState === 'analyzing' && <LoadingOverlay />}
            </AnimatePresence>
          </div>

          {showResult && (
            <ResultCard result={result} onRetry={handleRetry} />
          )}

          {showError && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-danger font-bold text-center">
                エラーが発生しました。もう一度お試しください。
              </p>
              <button
                onClick={handleRetry}
                className="bg-primary text-white font-bold py-3 px-6 rounded-[var(--radius-btn)] shadow-md
                           active:shadow-sm transition-shadow"
              >
                🔄 再試行
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
