import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { PRIMARY_MODEL, FALLBACK_MODEL, SYSTEM_PROMPT } from './api/_config.js'

function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Strip query parameters if any from the URL check
        const urlPath = req.url ? req.url.split('?')[0] : ''
        
        if (urlPath === '/api/chat' && req.method === 'POST') {
          try {
            let bodyStr = ''
            for await (const chunk of req) {
              bodyStr += chunk
            }
            const { message, history = [] } = JSON.parse(bodyStr)

            const envPath = path.resolve(process.cwd(), '.env')
            let apiKey = process.env.GEMINI_API_KEY
            if (!apiKey && fs.existsSync(envPath)) {
              const envContent = fs.readFileSync(envPath, 'utf8')
              const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/)
              if (match) apiKey = match[1].trim()
            }

            if (!apiKey) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured in .env' }))
              return
            }

            const contents = [
              ...history.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: String(m.content) }]
              })),
              { role: 'user', parts: [{ text: message }] }
            ]

            const makeGeminiRequest = async (modelName) => {
              const geminiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents,
                    systemInstruction: { parts: [{ text: SYSTEM_PROMPT.trim() }] },
                    generationConfig: {
                      maxOutputTokens: 512,
                      temperature: 0.7,
                    },
                  }),
                }
              )
              const data = await geminiRes.json()
              if (!geminiRes.ok) {
                const err = new Error(data?.error?.message ?? 'Gemini API error')
                err.status = geminiRes.status
                throw err
              }
              return data
            }

            let data
            try {
              console.log(`[local-api] Attempting primary model: ${PRIMARY_MODEL}`)
              data = await makeGeminiRequest(PRIMARY_MODEL)
            } catch (primaryErr) {
              if (primaryErr.status === 503 || primaryErr.status === 429 || primaryErr.status === 500) {
                console.warn(`[local-api] Primary model failed (${primaryErr.status}). Falling back to: ${FALLBACK_MODEL}`)
                data = await makeGeminiRequest(FALLBACK_MODEL)
              } else {
                throw primaryErr
              }
            }

            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ reply }))
          } catch (err) {
            console.error('[local-api] error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message }))
          }
          return
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
})
