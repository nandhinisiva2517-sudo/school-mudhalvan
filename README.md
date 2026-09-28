# SparkLearn

> AI-powered educational portal for Tamil Nadu schools, Standards 1–12.

## Quick Start

### Prerequisites
- Node.js 18+ (download from https://nodejs.org)
- A Supabase account with a PostgreSQL database
- (Optional) Upstash Redis account for rate limiting

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, GEMINI_API_KEY
```

### 3. Set up the database
```bash
# Run migrations
npm run db:dev

# Seed Tamil Nadu schools from the CSV (58k rows)
npm run db:seed:schools

# Seed curriculum modules and tasks
npm run db:seed:modules
```

### 4. Start the dev server
```bash
npm run dev
# Open http://localhost:3000
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + design token layer |
| Animation | Framer Motion |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth (Credentials + JWT) |
| Validation | Zod + React Hook Form |
| Charts | Recharts |
| AI Sandbox | Google Gemini API |
| Rate Limiting | Upstash Redis |
| Hosting | Vercel + Supabase |

## Project Structure

```
sparklearn/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed/
│       ├── seed-schools.ts    # Import 58k Tamil Nadu schools
│       └── seed-modules.ts    # Curriculum modules & tasks
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & registration pages
│   │   ├── (student)/         # Student dashboard (session-driven)
│   │   ├── (staff)/           # Staff dashboard + analytics
│   │   └── api/               # All API routes
│   ├── components/
│   │   ├── registration/      # SchoolAutocomplete
│   │   └── dashboards/        # K3, Standard, Staff table, Prompt sandbox
│   ├── lib/                   # Prisma, auth, RBAC, validations
│   └── styles/tokens.css      # SparkLearn design tokens
```

## Design System

**Colors:**
- `--spark-primary`: #FF8A3D (marigold-amber)
- `--spark-secondary`: #E8447A (raspberry)
- `--spark-tech`: #7C5CFC (electric violet, Std 11-12 only)
- `--spark-success`: #2FB88B (leaf green)
- `--spark-bg`: #FFF9F0 (warm paper)
- `--spark-ink`: #33302B (warm charcoal)

**Three age-tiered visual systems:**
1. **Std 1–5 (K-5):** Large animated tiles, Baloo 2 font, full saturation
2. **Std 6–10 (Transitional):** Digital notebook layout, calmer palette
3. **Std 11–12 (Advanced Lab):** Dense grid, dark theme, violet accent, JetBrains Mono

## Privacy (DPDP Act 2023)

- Guardian email captured at registration
- `consentAt` timestamp gates student access
- No behavioral ad tracking
- Data minimization enforced at schema level
- Contact: privacy@sparklearn.in

## Security

- bcrypt cost factor 12 for passwords
- NextAuth JWT sessions (httpOnly, secure, sameSite=lax)
- Zod validation on all API inputs
- Parameterized queries (Prisma + raw SQL)
- Rate limiting on auth + search endpoints
- RBAC middleware on all routes
- No API keys in client bundles

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Set `prisma migrate deploy` as a release step
5. Configure Sentry for error monitoring
<!-- Trigger Vercel Build -->
