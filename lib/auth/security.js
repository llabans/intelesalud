import { createHmac } from 'crypto';
import { prisma } from '../db';

/**
 * Pseudonymize an IP address using HMAC-SHA256.
 * The same IP always produces the same hash (for correlation),
 * but the original IP cannot be recovered.
 */
export function pseudonymizeIp(ip) {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) {
    console.warn('[Security] IP_HASH_SECRET not set, using fallback');
    return 'no-hash-secret';
  }
  return createHmac('sha256', secret).update(ip).digest('hex').slice(0, 32);
}

/**
 * Extract client IP from request headers (behind nginx/Cloudflare proxy).
 */
export function extractClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '0.0.0.0';
}

/**
 * Record an authentication event to the AuthEvent table.
 */
export async function recordAuthEvent({ userId, eventName, ip, userAgent, detail }) {
  try {
    await prisma.authEvent.create({
      data: {
        userId: userId || null,
        eventName,
        ipHash: pseudonymizeIp(ip),
        userAgent: userAgent || null,
        detail: detail ? JSON.stringify(detail) : null,
      },
    });
  } catch (error) {
    console.error('[Security] Failed to record auth event:', error);
  }
}

/**
 * Simple in-memory sliding window rate limiter.
 * Tracks requests per key (e.g., IP) within a time window.
 */
export class RateLimiter {
  constructor({ maxRequests = 20, windowMs = 3600000 } = {}) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const timestamps = this.requests.get(key).filter(t => t > windowStart);
    this.requests.set(key, timestamps);

    if (timestamps.length >= this.maxRequests) {
      return false;
    }

    timestamps.push(now);
    return true;
  }
}

export const authRateLimiter = new RateLimiter({ maxRequests: 20, windowMs: 3600000 });
