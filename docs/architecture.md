# Architecture Overview

TruckOps follows a layered architecture:

- **Web (Next.js App Router):** user interface and authenticated dashboards
- **API (Express):** application logic, validation, and access control
- **Database (Supabase/Postgres):** persistent data for dispatch operations

Flow: Browser → Next.js UI → Express API → Supabase
