import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const MODEL_NAME = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 300

const SYSTEM_PROMPT = `あなたは猫の健康管理の専門家です。
画像に写っているものを特定し、猫が食べて安全かどうかを判定してください。

必ず以下のJSON形式のみで返答してください。JSON以外のテキストは一切含めないでください。

{
  "safety": "safe" | "dangerous" | "caution" | "unknown",
  "itemName": "画像に写っているものの名前（日本語）",
  "reason": "判定理由（日本語・1〜2文）",
  "confidence": "high" | "medium" | "low"
}

各フィールドの説明:
- safety: "safe"=猫が食べても安全, "dangerous"=猫にとって危険, "caution"=要注意（少量なら問題ないが注意が必要）, "unknown"=判定不能
- itemName: 画像に写っているものの名前（日本語で記述）
- reason: 判定理由を日本語で1〜2文で簡潔に説明
- confidence: 判定の確信度（"high" / "medium" / "low"）`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const { image } = req.body
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Image is required' })
    }

    const client = new Anthropic({ apiKey })
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
              source: { type: 'base64', media_type: 'image/jpeg', data: image },
            },
          ],
        },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const text = textBlock?.type === 'text' ? textBlock.text : ''
    return res.status(200).json({ text })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'API呼び出しに失敗しました'
    return res.status(500).json({ error: message })
  }
}
