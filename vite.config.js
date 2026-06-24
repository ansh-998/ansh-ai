import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { PRIMARY_MODEL, FALLBACK_MODEL, SYSTEM_PROMPT } from './api/_config.js'

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

            if (!name || !email || !message) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Name, email, and message are required.' }))
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

            const mailOptions = {
              from: `"${name}" <${email}>`,
              to: emailUser,
              replyTo: email,
              subject: `Portfolio Enquiry from ${name}`,
              text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
              html: `<p><strong>Name:</strong> ${name}</p>
                     <p><strong>Email:</strong> ${email}</p>
                     <br/>
                     <p><strong>Message:</strong></p>
                     <p>${message.replace(/\n/g, '<br/>')}</p>`,
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
