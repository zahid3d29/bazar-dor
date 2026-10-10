# বাজার দর | BazarDor

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম, বাজারভিত্তিক তুলনা এবং দৈনিক মূল্য পরিবর্তন এক জায়গায় দেখার responsive web app.

## Technologies

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4, with a custom responsive design system
- Better Auth with SQLite locally or PostgreSQL in production, plus optional Google/GitHub OAuth
- Live product and category data from the Bazar Dor API
- Lucide icons and react-hot-toast

## Features

1. Bengali market-price ticker, category navigation, and responsive home dashboard.
2. Top daily price gainers and fallers plus a complete product catalog.
3. Category filtering with numeric low-to-high and high-to-low price sorting.
4. Protected product details with low, high, average, and market-by-market prices.
5. Better Auth email/password registration and sign-in with session-protected pages.
6. Optional Google and GitHub OAuth when provider credentials are configured.
7. Profile name editing, loading skeletons, toast feedback, and friendly not-found states.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set a private `BETTER_AUTH_SECRET` (at least 32 characters). Keep all secrets out of git.
3. Create the local auth tables with `npm run auth:migrate` and confirm the migration when prompted.
4. Run `npm run dev` and open `http://localhost:3000`.

The SQLite file defaults to `./bazar-dor.sqlite` and is ignored by git. Google and GitHub buttons need the corresponding OAuth client ID/secret and registered callback URLs. Social providers are omitted from Better Auth when those values are absent; also set the matching `NEXT_PUBLIC_*_AUTH_ENABLED=true` flag to enable its button flow.

## Production deployment

Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in the hosting environment. For Vercel or another serverless host, set `DATABASE_URL` to a persistent PostgreSQL database; the included SQLite file is for local development only. Run the auth migration with the same database environment before deploying. Set Google/GitHub credentials if those providers should be enabled, and configure the `/api/auth/callback/google` and `/api/auth/callback/github` provider callback URLs for the deployed domain.

Run `npm run lint` and `npm run build` before deployment.
