// api/chat.js — Vercel Serverless Function
// ─────────────────────────────────────────────────────────────────────────────
// GEMINI_API_KEY lives ONLY here via Vercel env vars — it never reaches the browser.
// Set it in: Vercel Dashboard → Project → Settings → Environment Variables
// ─────────────────────────────────────────────────────────────────────────────

import { PRIMARY_MODEL, FALLBACK_MODEL, SYSTEM_PROMPT } from './_config.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message, history = [] } = req.body ?? {}

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('[api/chat] GEMINI_API_KEY is not configured')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Build Gemini-format conversation from history + new message
  const contents = [
    ...history
      .filter((m) => m.role && m.content)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(m.content) }],
      })),
    { role: 'user', parts: [{ text: message.trim() }] },
  ]

  const makeGeminiRequest = async (modelName) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          },
        }),
      }
    )
    const data = await response.json()
    if (!response.ok) {
      const err = new Error(data?.error?.message ?? 'Gemini API error')
      err.status = response.status
      throw err
    }
    return data
  }

  try {
    let data
    try {
      console.log(`[api/chat] Attempting primary model: ${PRIMARY_MODEL}`)
      data = await makeGeminiRequest(PRIMARY_MODEL)
    } catch (primaryErr) {
      // 503 (Unavailable), 429 (Rate Limit), or 500 triggers the fallback
      if (primaryErr.status === 503 || primaryErr.status === 429 || primaryErr.status === 500) {
        console.warn(`[api/chat] Primary model failed (${primaryErr.status}). Falling back to: ${FALLBACK_MODEL}`)
        data = await makeGeminiRequest(FALLBACK_MODEL)
      } else {
        throw primaryErr
      }
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!reply) throw new Error('Empty response from AI')

    return res.status(200).json({ reply })
  } catch (err) {
    console.error('[api/chat] Final failure:', err.message)
    if (err.status === 429) {
      return res.status(429).json({
        error: "I'm getting a lot of questions right now! Please try again in a minute.",
      })
    }
    return res.status(500).json({
      error:
        "I'm having a bit of trouble right now. Feel free to explore the Projects and Skills pages, or reach out directly at anshgangwar998@gmail.com!",
    })
  }
}
