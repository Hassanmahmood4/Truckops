# Testing Checklist

## Authentication
- Landing page loads without auth redirect
- Sign-in completes and lands on dashboard
- Signed-out users cannot access `/dashboard`

## Dashboard
- Drivers table loads and supports create/delete
- Loads page supports quote save and delivery mark
- Assignments page creates active assignment correctly

## API
- `/health` endpoint is reachable
- Protected `/api/*` requests reject missing token
