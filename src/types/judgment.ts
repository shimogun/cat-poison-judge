/**
 * judgment.ts
 * 判定結果とアプリ状態の型定義
 * - Safety: 猫にとっての安全性レベル
 * - AppState: アプリの画面状態
 * - JudgmentResult: Vision API からの判定結果
 */

export type Safety = 'safe' | 'dangerous' | 'caution' | 'unknown'
export type AppState = 'idle' | 'capturing' | 'analyzing' | 'result' | 'error'

export interface JudgmentResult {
  safety: Safety
  itemName: string       // 撮影されたものの名前（日本語）
  reason: string         // 判定理由（日本語・1〜2文）
  confidence: 'high' | 'medium' | 'low'
}
