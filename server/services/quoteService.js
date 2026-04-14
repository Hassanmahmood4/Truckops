import { QUOTE_RATE_PER_UNIT } from '../config/constants.js';

/**
 * Simple quote: price = distance * rate (per business rules).
 */
export function calculateQuotePrice(distance) {
  const d = Number(distance);
  if (!Number.isFinite(d) || d < 0) {
    throw Object.assign(new Error('distance must be a non-negative number'), { statusCode: 400 });
  }
  const price = Math.round(d * QUOTE_RATE_PER_UNIT * 100) / 100;
  return price;
}
