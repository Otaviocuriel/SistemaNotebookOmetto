import type { NextFunction, Request, Response } from "express";

type AccessRecord = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message: string;
};

export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  next();
}

export function createRateLimiter({
  windowMs,
  max,
  message,
}: RateLimitOptions) {
  const accesses = new Map<string, AccessRecord>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const current = accesses.get(key);

    if (!current || current.resetAt <= now) {
      accesses.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > max) {
      res.setHeader(
        "Retry-After",
        String(Math.ceil((current.resetAt - now) / 1000))
      );
      return res.status(429).json({ message });
    }

    next();
  };
}

