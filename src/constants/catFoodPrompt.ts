/**
 * catFoodPrompt.ts
 * Claude Haiku 4.5 Vision API に送信するシステムプロンプト
 * - 猫の健康管理専門家としての役割定義
 * - JSON形式のレスポンススキーマ指定
 * - safety / itemName / reason / confidence の出力仕様
 */

/** Claude Haiku 4.5 のモデル名 */
export const MODEL_NAME = 'claude-haiku-4-5-20251001' as const;

/** レスポンスの最大トークン数 */
export const MAX_TOKENS = 300 as const;

/** safety フィールドの許容値 */
export const SAFETY_VALUES = {
  SAFE: 'safe',
  DANGEROUS: 'dangerous',
  CAUTION: 'caution',
  UNKNOWN: 'unknown',
} as const;

/** confidence フィールドの許容値 */
export const CONFIDENCE_VALUES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

/** Claude Haiku 4.5 Vision API に送信するシステムプロンプト */
export const SYSTEM_PROMPT = `あなたは猫の健康管理の専門家です。
画像に写っているものを特定し、猫が食べて安全かどうかを判定してください。

必ず以下のJSON形式のみで返答してください。JSON以外のテキストは一切含めないでください。

{
  "safety": "${SAFETY_VALUES.SAFE}" | "${SAFETY_VALUES.DANGEROUS}" | "${SAFETY_VALUES.CAUTION}" | "${SAFETY_VALUES.UNKNOWN}",
  "itemName": "画像に写っているものの名前（日本語）",
  "reason": "判定理由（日本語・1〜2文）",
  "confidence": "${CONFIDENCE_VALUES.HIGH}" | "${CONFIDENCE_VALUES.MEDIUM}" | "${CONFIDENCE_VALUES.LOW}"
}

各フィールドの説明:
- safety: "${SAFETY_VALUES.SAFE}"=猫が食べても安全, "${SAFETY_VALUES.DANGEROUS}"=猫にとって危険, "${SAFETY_VALUES.CAUTION}"=要注意（少量なら問題ないが注意が必要）, "${SAFETY_VALUES.UNKNOWN}"=判定不能
- itemName: 画像に写っているものの名前（日本語で記述）
- reason: 判定理由を日本語で1〜2文で簡潔に説明
- confidence: 判定の確信度（"${CONFIDENCE_VALUES.HIGH}" / "${CONFIDENCE_VALUES.MEDIUM}" / "${CONFIDENCE_VALUES.LOW}"）` as const;
