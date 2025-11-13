// Simple in-memory rate limiter for scraping requests
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 5, windowMs: number = 60000) { // 5 requests per minute default
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(key: string = 'default'): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Get existing requests for this key
    const timestamps = this.requests.get(key) || []

    // Filter out old requests
    const validRequests = timestamps.filter(timestamp => timestamp > windowStart)

    // Check if we're at the limit
    if (validRequests.length >= this.maxRequests) {
      return false
    }

    // Add current request
    validRequests.push(now)
    this.requests.set(key, validRequests)

    return true
  }

  getRemainingRequests(key: string = 'default'): number {
    const now = Date.now()
    const windowStart = now - this.windowMs

    const timestamps = this.requests.get(key) || []
    const validRequests = timestamps.filter(timestamp => timestamp > windowStart)

    return Math.max(0, this.maxRequests - validRequests.length)
  }

  getResetTime(key: string = 'default'): number {
    const timestamps = this.requests.get(key) || []
    if (timestamps.length === 0) return 0

    const oldestRequest = Math.min(...timestamps)
    return oldestRequest + this.windowMs
  }
}

// Export singleton instances for different use cases
export const autotraderRateLimiter = new RateLimiter(3, 60000) // 3 requests per minute for AutoTrader
export const generalRateLimiter = new RateLimiter(10, 60000) // 10 requests per minute for general use