import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import type { IncomingMessage, ServerResponse } from 'http'

function apiDevProxy(apiKey: string): Plugin {
  return {
    name: 'api-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/judge', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const { image } = JSON.parse(body)
            const Anthropic = (await import('@anthropic-ai/sdk')).default
            const client = new Anthropic({ apiKey })

            const response = await client.messages.create({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 300,
              system: `あなたは猫の健康管理の専門家です。画像に写っているものを特定し、猫が食べて安全かどうかを判定してください。必ず以下のJSON形式のみで返答してください。JSON以外のテキストは一切含めないでください。{"safety":"safe"|"dangerous"|"caution"|"unknown","itemName":"名前（日本語）","reason":"理由（日本語・1〜2文）","confidence":"high"|"medium"|"low"}`,
              messages: [{
                role: 'user',
                content: [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } }],
              }],
            })

            const textBlock = response.content.find((b) => b.type === 'text')
            const text = textBlock?.type === 'text' ? textBlock.text : ''
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ text }))
          } catch (err) {
            const message = err instanceof Error ? err.message : 'API error'
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: message }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      basicSsl(),
      apiDevProxy(env.ANTHROPIC_API_KEY ?? ''),
    ],
    server: {
      host: true,
    },
  }
})
