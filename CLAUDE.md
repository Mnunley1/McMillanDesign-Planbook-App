# McMillan Design Planbook App

## Project Overview
A React SPA for browsing and managing residential floor plans. Features Algolia-powered search/filtering, Contentful CMS for plan data, Clerk authentication, and Cloudinary for media storage. Deployed on Vercel.

## Tech Stack
- **Framework**: React 18 + TypeScript (strict mode)
- **Build**: Vite (dev server port 3000)
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style) + Radix UI
- **Search**: Algolia (react-instantsearch)
- **CMS**: Contentful (production + preview clients)
- **Auth**: Clerk (@clerk/clerk-react)
- **Media**: Cloudinary (images + PDFs)
- **Data**: TanStack React Query + React Table
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v7

## Commands
- `npm run dev` — Start dev server (port 3000)
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — Biome lint + format check (via Ultracite)
- `npm run lint:fix` — Auto-fix lint + format issues
- `npm run format` — Format all files with Biome
- `npm run preview` — Preview production build

## Project Structure
```
src/
├── app/              # App-specific pages (dashboard)
├── components/       # React components
│   └── ui/           # shadcn/ui primitives (do not manually edit)
├── pages/            # Route-level pages (Home, Master, SignIn)
├── hooks/            # Custom React hooks
├── lib/              # Utilities & client configs (contentful.ts, utils.ts)
├── utils/            # App utilities (planUtils.ts)
├── types/            # TypeScript type definitions
├── styles/           # Style assets
├── router.tsx        # Route definitions with auth guards
├── main.tsx          # App entry with providers
├── index.css         # Global styles + Tailwind + CSS theme variables
└── env.d.ts          # Vite environment variable types
```

## Key Architecture
- **Two Algolia indices**: `floorPlans` (public) and `allPlans` (admin/master)
- **Auth guard**: Protected routes require Clerk sign-in; admin routes check `user.publicMetadata.role`
- **Contentful clients**: Production client for published content, preview client for draft content on /master route
- **Dark theme enforced** via next-themes provider
- **SPA routing**: Vercel rewrites all routes to index.html

## Path Aliases (tsconfig)
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@styles/*` → `src/styles/*`

## Environment Variables
All client-side vars use `VITE_` prefix. Required:
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk auth
- `VITE_ALGOLIA_APP_ID`, `VITE_ALGOLIA_SEARCH_API_KEY` — Algolia search
- `VITE_CONTENTFUL_SPACE_ID`, `VITE_CONTENTFUL_ACCESS_TOKEN`, `VITE_CONTENTFUL_PREVIEW_TOKEN` — Contentful CMS
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_API_KEY` — Cloudinary media

## Conventions
- **Components**: PascalCase filenames, functional components with hooks
- **Utilities**: camelCase filenames
- **Styling**: Tailwind utility classes; use `cn()` helper from lib/utils for conditional classes
- **shadcn/ui**: Add new components via CLI (`npx shadcn-ui@latest add <component>`), don't manually edit `src/components/ui/`
- **Icons**: Lucide React (primary), React Icons, Tabler Icons
- **Type safety**: Define interfaces for all props and API responses
- **Mobile-first**: Responsive with `md:` breakpoint (768px)

## Git Workflow
- **main** — Production branch
- **dev** — Development branch
- PRs go from dev → main
- Deployment: Vercel auto-deploys from main

## Important Notes
- Never commit `.env.local` or any env files with secrets
- **Linting**: Biome via Ultracite (replaced ESLint). Config in `biome.jsonc`. `src/components/ui/` is excluded from linting.
- `src/components/ui/` contains shadcn/ui generated components — avoid manual edits
- "Recently Added" badge shows on plans created within the last 45 days
