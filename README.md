# macOS-iOS Free Apps Directory

macOS-iOS is a Next.js directory that showcases high-quality free apps for macOS and iOS. Visitors can explore featured apps, filter by category or platform, search by name, view rich app detail pages, and save favorites with authenticated bookmarks. The experience is optimized for dark/light themes, includes screenshot galleries, and keeps app data in a Turso-backed database managed via Drizzle ORM and Better Auth.

## Key Features
- **Curated discovery:** Home page hero with search, filter controls, and a responsive grid of app cards powered by live database queries.
- **Detailed app pages:** Deep dive on each app with descriptions, screenshots, ratings, download links, and metadata cards.
- **Bookmarking with auth:** Better Auth secures sessions (email/password ready, bearer tokens stored client-side) so users can bookmark apps.
- **Theming and UX:** Framer Motion hero animations, dark/light theme toggle, and polished UI components built with shadcn/ui.
- **Typed data layer:** Turso (libSQL) + Drizzle schema for apps, bookmarks, and Better Auth tables.

## Prerequisites
- Node.js 18+ and npm.
- Turso CLI for database provisioning.
- Git for version control.

## Setup
1. **Install dependencies (npm only)**
   Use npm to avoid competing lockfiles that cause merge conflicts.
   ```bash
   npm install
   ```

2. **Provision Turso**
   ```bash
   turso auth login            # authenticate with Turso
   turso db create macos-ios   # create a database
   turso db show macos-ios     # note the connection URL
   turso db tokens create macos-ios  # generate an auth token
   ```

3. **Apply schema with Drizzle**
   Create a `.env.local` file (see variables below), then run:
   ```bash
   npx drizzle-kit push
   ```

4. **Better Auth configuration**
   Better Auth is already wired to Drizzle. To enable production-ready URLs, set `NEXT_PUBLIC_SITE_URL` to the domain you deploy to; in development it defaults to `http://localhost:3000`.

5. **Start the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 to explore the app catalog.

## Environment Variables
Create `.env.local` at the project root with:

```
TURSO_CONNECTION_URL=<libsql connection string from Turso>
TURSO_AUTH_TOKEN=<libsql auth token from Turso>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are used by Drizzle and Turso client to connect to the database.
- `NEXT_PUBLIC_SITE_URL` lets Better Auth generate correct callbacks when rendering on the server.

## Running, Building, Deploying
- **Development:** `npm run dev`
- **Type check & lint:** `npm run lint`
- **Production build:** `npm run build`
- **Start production server:** `npm run start`
- **Database migrations:** `npx drizzle-kit push`
- **Deploy:** Deploy the Next.js app to Vercel or any Node-compatible host. Ensure the environment variables above are set in your hosting provider and the database is reachable from the deployment region.

## Contribution Guidelines
- **Branching:** Use feature branches and open pull requests; keep changes focused and well-described.
- **Code style:** Follow existing TypeScript, React Server Components, and shadcn/ui patterns. Prefer functional components, typed props, and avoid wrapping imports in try/catch.
- **Database changes:** Update `src/db/schema.ts` and regenerate migrations with `npx drizzle-kit push`. Document any schema changes in the PR.
- **Auth flow:** Keep Better Auth client/server configuration in `src/lib/auth.ts` and `src/lib/auth-client.ts` consistent; avoid duplicating token handling logic.
- **Testing:** Run relevant checks (`npm run lint` and `npm run build`) before submitting.
- **Commits:** Write clear, conventional commit messages and keep diffs minimal.
