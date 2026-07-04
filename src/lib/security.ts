// In-memory rate limiting for serverless/API routes
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRateLimits = new Map<string, RateLimitRecord>();

/**
 * Checks if an IP has exceeded the rate limit.
 * @param ip Client IP address or identifier
 * @param limit Maximum requests per window (default: 30 requests)
 * @param windowMs Window duration in ms (default: 1 minute)
 * @returns { success: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  ip: string = "anonymous",
  limit: number = 30,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = ipRateLimits.get(ip);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    ipRateLimits.set(ip, newRecord);
    return {
      success: true,
      remaining: limit - 1,
      resetTime: newRecord.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Basic XSS and injection sanitization for user text input
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Extracts IP address from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}
