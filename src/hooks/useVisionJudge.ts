/**
 * useVisionJudge.ts
 * Claude Haiku 4.5 Vision API 呼び出しカスタムフック
 * - @anthropic-ai/sdk を使用
 * - base64 画像を受け取り判定リクエストを送信
 * - レスポンス JSON をパースして JudgmentResult 型に変換
 * - パース失敗時は safety: 'unknown' を返す
 */

import { useState, useCallback } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import type { JudgmentResult } from '../types/judgment'
import { MODEL_NAME, MAX_TOKENS, SYSTEM_PROMPT } from '../constants/catFoodPrompt'

const VALID_SAFETY: readonly string[] = ['safe', 'dangerous', 'caution', 'unknown']
const VALID_CONFIDENCE: readonly string[] = ['high', 'medium', 'low']

const UNKNOWN_RESULT: JudgmentResult = {
  safety: 'unknown',
  itemName: '不明',
  reason: '判定できませんでした',
  confidence: 'low',
}

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
  dangerouslyAllowBrowser: true,
})

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
      const response = await client.messages.create({
        model: MODEL_NAME,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      })

      const textBlock = response.content.find((block) => block.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        setResult(UNKNOWN_RESULT)
        return UNKNOWN_RESULT
      }

      const judgment = parseJudgmentResponse(textBlock.text)
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
