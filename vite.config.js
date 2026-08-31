import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { PRIMARY_MODEL, FALLBACK_MODEL, SYSTEM_PROMPT } from './api/_config.js'
import { escapeHtml } from './api/_security.js'

/**
 * Local API Dev Server Middleware
 * 
 * Vite acts as a frontend-only development server and does not run Vercel serverless functions by default.
 * This plugin attaches Connect middleware to intercept local requests to '/api/chat' and '/api/contact'.
 */
function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url ? req.url.split('?')[0] : ''
        
        // --- CHAT API HANDLER ---
        if (urlPath === '/api/chat' && req.method === 'POST') {
          try {
            let bodyStr = ''
            for await (const chunk of req) {
              bodyStr += chunk
            }
            const { message, history = [] } = JSON.parse(bodyStr)

            if (!message || typeof message !== 'string' || !message.trim()) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'message is required' }))
              return
            }

            const trimmedMessage = message.trim()
            if (trimmedMessage.length > 1000) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Message exceeds maximum allowed length of 1000 characters.' }))
              return
            }

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

            const safeHistory = Array.isArray(history)
              ? history
                  .slice(-10)
                  .filter((m) => m && m.role && typeof m.content === 'string')
                  .map((m) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: String(m.content).slice(0, 1000) }],
                  }))
              : []

            const contents = [
              ...safeHistory,
              { role: 'user', parts: [{ text: trimmedMessage }] }
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
            console.error('[local-api] chat error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message }))
          }
          return
        }

        // --- CONTACT API HANDLER ---
        if (urlPath === '/api/contact' && req.method === 'POST') {
          try {
            let bodyStr = ''
            for await (const chunk of req) {
              bodyStr += chunk
            }
            const { name, email, message } = JSON.parse(bodyStr)

            if (!name || typeof name !== 'string' || !email || typeof email !== 'string' || !message || typeof message !== 'string') {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Name, email, and message are required.' }))
              return
            }

            const cleanName = name.trim()
            const cleanEmail = email.trim()
            const cleanMessage = message.trim()

            if (!cleanName || !cleanEmail || !cleanMessage) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Name, email, and message cannot be empty.' }))
              return
            }

            if (cleanName.length > 100 || cleanEmail.length > 100 || cleanMessage.length > 3000) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Input fields exceed allowed character limits.' }))
              return
            }

            const envPath = path.resolve(process.cwd(), '.env')
            let emailUser = process.env.EMAIL_USER
            let emailPass = process.env.EMAIL_PASS

            if ((!emailUser || !emailPass) && fs.existsSync(envPath)) {
              const envContent = fs.readFileSync(envPath, 'utf8')
              const userMatch = envContent.match(/EMAIL_USER\s*=\s*(.*)/)
              const passMatch = envContent.match(/EMAIL_PASS\s*=\s*(.*)/)
              if (userMatch) emailUser = userMatch[1].trim()
              if (passMatch) emailPass = passMatch[1].trim()
            }

            if (!emailUser || !emailPass) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Server configuration error: EMAIL_USER or EMAIL_PASS missing from .env file.' }))
              return
            }

            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: emailUser,
                pass: emailPass,
              },
            })

            const safeName = escapeHtml(cleanName)
            const safeEmail = escapeHtml(cleanEmail)
            const safeMessage = escapeHtml(cleanMessage)

            const mailOptions = {
              from: `"${safeName}" <${safeEmail}>`,
              to: emailUser,
              replyTo: cleanEmail,
              subject: `Portfolio Enquiry from ${cleanName}`,
              text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
              html: `<p><strong>Name:</strong> ${safeName}</p>
                     <p><strong>Email:</strong> ${safeEmail}</p>
                     <br/>
                     <p><strong>Message:</strong></p>
                     <p>${safeMessage.replace(/\n/g, '<br/>')}</p>`,
            }

            await transporter.sendMail(mailOptions)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, message: 'Email sent successfully!' }))
          } catch (err) {
            console.error('[local-api] contact error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Failed to send email. Please try again later.' }))
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
