// api/_security.js

/**
 * Escapes HTML characters to prevent script injection / HTML formatting breaks.
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Validates and sets strict CORS headers on incoming Vercel serverless HTTP requests.
 * @returns {boolean} True if origin is allowed, false if rejected.
 */
export function validateAndCleanOrigin(req, res) {
  const allowedOrigins = [
    process.env.ALLOWED_ORIGIN,
    'https://ansh-ai-olive.vercel.app',
    'https://ansh-portfolio.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ].filter(Boolean)

  const origin = req.headers.origin || req.headers.referer

  // Extract base origin if referer is provided
  let reqOrigin = null
  if (origin) {
    try {
      const url = new URL(origin)
      reqOrigin = url.origin
    } catch {
      reqOrigin = origin
    }
  }

  // If request has an origin, verify it matches allowed origins list
  if (reqOrigin) {
    if (allowedOrigins.includes(reqOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', reqOrigin)
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      return true
    } else {
      res.statusCode = 403
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'CORS policy: Origin not allowed' }))
      return false
    }
  }

  // Fallback for same-origin or direct non-browser requests
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  return true
}
