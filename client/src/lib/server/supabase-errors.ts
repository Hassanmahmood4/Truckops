export function isMissingRelationError(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const code = 'code' in error ? String((error as { code?: string }).code ?? '') : ''
  const message = 'message' in error ? String((error as { message?: string }).message ?? '') : ''
  return code === '42P01' || code === 'PGRST205' || /schema cache|does not exist/i.test(message)
}

export function relationMissingResponse(entityName: string) {
  return {
    error: `Database tables are not initialized for ${entityName}. Run database/schema.sql in Supabase SQL Editor.`,
  }
}
