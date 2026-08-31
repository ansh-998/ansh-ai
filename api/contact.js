import nodemailer from 'nodemailer'
import { checkRateLimit } from './_rateLimit.js'
import { validateAndCleanOrigin, escapeHtml } from './_security.js'

export default async function handler(req, res) {
  // CORS Security Check
  if (!validateAndCleanOrigin(req, res)) return

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Server-side Rate Limiting (3 contact submissions per 10 minutes per IP)
  if (!checkRateLimit(req, res, { windowMs: 10 * 60 * 1000, maxRequests: 3 })) return

  const { name, email, message } = req.body || {}

  // Validation
  if (
    !name ||
    typeof name !== 'string' ||
    !email ||
    typeof email !== 'string' ||
    !message ||
    typeof message !== 'string'
  ) {
    return res.status(400).json({ error: 'Name, email, and message are required strings.' })
  }

  const cleanName = name.trim()
  const cleanEmail = email.trim()
  const cleanMessage = message.trim()

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({ error: 'Name, email, and message cannot be empty.' })
  }

  if (cleanName.length > 100) {
    return res.status(400).json({ error: 'Name exceeds maximum allowed length of 100 characters.' })
  }

  if (cleanEmail.length > 100) {
    return res.status(400).json({ error: 'Email exceeds maximum allowed length of 100 characters.' })
  }

  if (cleanMessage.length > 3000) {
    return res.status(400).json({ error: 'Message exceeds maximum allowed length of 3000 characters.' })
  }

  // Ensure environment variables are present
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!user || !pass) {
    console.error('[api/contact] Missing EMAIL_USER or EMAIL_PASS environment variables.')
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    })

    // Escape HTML inputs to prevent script injection / HTML formatting breaks
    const safeName = escapeHtml(cleanName)
    const safeEmail = escapeHtml(cleanEmail)
    const safeMessage = escapeHtml(cleanMessage)

    const mailOptions = {
      from: `"${safeName}" <${safeEmail}>`,
      to: user,
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

    return res.status(200).json({ success: true, message: 'Email sent successfully!' })
  } catch (error) {
    console.error('[api/contact] Error sending email:', error)
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' })
  }
}
