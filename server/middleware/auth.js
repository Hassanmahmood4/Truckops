import { verifyToken } from '@clerk/backend';

const secretKey = process.env.CLERK_SECRET_KEY;

/**
 * Verifies Clerk session JWT from Authorization: Bearer <token>.
 * Attaches authUserId (Clerk user id) to req for downstream handlers.
 * If CLERK_SECRET_KEY is unset (local dev), allows requests with optional x-user-id header.
 */
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (secretKey && token) {
      const payload = await verifyToken(token, { secretKey });
      req.authUserId = payload.sub;
      return next();
    }

    if (!secretKey) {
      const fallback = req.headers['x-user-id'];
      if (typeof fallback === 'string' && fallback.length > 0) {
        req.authUserId = fallback;
        return next();
      }
      return res.status(401).json({
        error: 'Unauthorized',
        details: 'Set CLERK_SECRET_KEY and send Authorization: Bearer <token>',
      });
    }

    return res.status(401).json({ error: 'Unauthorized', details: 'Missing or invalid token' });
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized', details: e.message });
  }
}
