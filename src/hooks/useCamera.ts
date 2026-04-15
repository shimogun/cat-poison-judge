/**
 * useCamera.ts
 * カメラ制御・撮影ロジックのカスタムフック
 * - getUserMedia でリアカメラ起動
 * - video ref / canvas ref の管理
 * - captureImage(): canvas に描画し base64(jpeg) を返す
 * - エラー種別の区別: NotAllowedError / NotFoundError / その他
 * - cleanup: アンマウント時にストリーム停止
 */

import { useRef, useEffect, useState, useCallback } from 'react'

type CameraErrorType = 'NotAllowedError' | 'NotFoundError' | 'UnknownError'

const JPEG_QUALITY = 0.8

const CAMERA_ERROR_MESSAGES: Record<CameraErrorType, string> = {
  NotAllowedError: 'カメラの使用を許可してください',
  NotFoundError: 'カメラが見つかりません',
  UnknownError: 'カメラの起動に失敗しました',
}

const classifyCameraError = (error: unknown): CameraErrorType => {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') return 'NotAllowedError'
    if (error.name === 'NotFoundError') return 'NotFoundError'
  }
  return 'UnknownError'
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setIsReady(true)
        setError(null)
      } catch (err) {
        const errorType = classifyCameraError(err)
        setError(CAMERA_ERROR_MESSAGES[errorType])
        setIsReady(false)
      }
    }

    startCamera()

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const captureImage = useCallback((): string | null => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
    return dataUrl.split(',')[1] ?? null
  }, [])

  return { videoRef, canvasRef, captureImage, error, isReady }
}
