// api/_rateLimit.js

const ipMap = new Map()

// Clean up expired IP entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of ipMap.entries()) {
    if (now > data.resetTime) {
      ipMap.delete(ip)
    }
  }
}, 5 * 60 * 1000)

/**
 * In-memory sliding-window IP rate limiter helper.
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {{ windowMs: number, maxRequests: number }} options
 * @returns {boolean} True if allowed, false if rate limited (res will be sent).
 */
export function checkRateLimit(req, res, { windowMs = 60 * 1000, maxRequests = 10 } = {}) {
  const rawIp =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1'

  const ip = String(rawIp).split(',')[0].trim()
  const now = Date.now()

  let record = ipMap.get(ip)

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs }
    ipMap.set(ip, record)
    return true
  }

  record.count += 1

  if (record.count > maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000)
    res.statusCode = 429
    res.setHeader('Retry-After', String(retryAfter))
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        error: `Too many requests. Please try again in ${retryAfter} seconds.`,
      })
    )
    return false
  }

  return true
}
