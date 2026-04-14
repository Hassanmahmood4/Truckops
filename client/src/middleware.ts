import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

/**
 * Only `/dashboard` requires a session.
 *
 * Important: the matcher must NOT include `/` (landing). Otherwise Clerk may redirect before the page runs.
 *
 * Include `/api/*` so `auth()` works in Route Handlers (Clerk requires clerkMiddleware on the same request).
 */
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/api/:path*',
  ],
}
