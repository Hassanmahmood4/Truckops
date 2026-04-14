# Deployment Notes

## Environment
- Configure Clerk keys for web and API
- Configure Supabase URL and service role key for API

## Build
- `npm run build --prefix client`

## Runtime
- API: `npm run start --prefix server`
- Web: `npm run start --prefix client`

## Validation
- Verify `/health` returns `ok: true`
- Verify sign-in redirects to `/dashboard`
