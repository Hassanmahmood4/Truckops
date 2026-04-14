import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

/**
 * Only `/dashboard` requires a session.
 *
 * Important: the middleware `matcher` must NOT include `/`. Otherwise Clerk runs
 * `authenticateRequest` on the landing page and may issue a `Location` redirect to
 * the sign-in / accounts flow before the route handler runs.
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
  ],
}
