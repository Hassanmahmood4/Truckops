/**
 * Central Express error handler — keeps controllers thin and responses consistent.
 */
export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  if (status === 500) {
    console.error('[FleetFlow]', err);
  }

  res.status(status).json({
    error: message,
    ...(err.details && { details: err.details }),
  });
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Not found' });
}
