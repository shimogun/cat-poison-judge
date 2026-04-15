/**
 * useVisionJudge.ts
 * 判定APIを呼び出すカスタムフック
 * - /api/judge エンドポイントにPOST（サーバーレス関数経由）
 * - レスポンス JSON をパースして JudgmentResult 型に変換
 * - パース失敗時は safety: 'unknown' を返す
 */

import { useState, useCallback } from 'react'
import type { JudgmentResult } from '../types/judgment'

const VALID_SAFETY: readonly string[] = ['safe', 'dangerous', 'caution', 'unknown']
const VALID_CONFIDENCE: readonly string[] = ['high', 'medium', 'low']

const UNKNOWN_RESULT: JudgmentResult = {
  safety: 'unknown',
  itemName: '不明',
  reason: '判定できませんでした',
  confidence: 'low',
}

function isValidJudgment(value: unknown): value is JudgmentResult {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.safety === 'string' &&
    VALID_SAFETY.includes(obj.safety) &&
    typeof obj.itemName === 'string' &&
    typeof obj.reason === 'string' &&
    typeof obj.confidence === 'string' &&
    VALID_CONFIDENCE.includes(obj.confidence)
  )
}

function parseJudgmentResponse(text: string): JudgmentResult {
  const cleaned = text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
  try {
    const parsed: unknown = JSON.parse(cleaned)
    if (isValidJudgment(parsed)) return parsed
    return UNKNOWN_RESULT
  } catch {
    return UNKNOWN_RESULT
  }
}

export function useVisionJudge() {
  const [result, setResult] = useState<JudgmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const judge = useCallback(async (base64Image: string): Promise<JudgmentResult | null> => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      })

      if (!response.ok) {
        const errorData: unknown = await response.json()
        const msg = typeof errorData === 'object' && errorData !== null && 'error' in errorData
          ? String((errorData as Record<string, unknown>).error)
          : 'API呼び出しに失敗しました'
        throw new Error(msg)
      }

      const data: unknown = await response.json()
      const text = typeof data === 'object' && data !== null && 'text' in data
        ? String((data as Record<string, unknown>).text)
        : ''

      const judgment = parseJudgmentResponse(text)
      setResult(judgment)
      return judgment
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'API呼び出しに失敗しました'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { result, isLoading, error, judge }
}
