# Realwood Furnishers: Website

**Transforming Spaces, Enriching Lives.** · Kahawa Wendani, Kiambu County, Kenya

React 18 + TypeScript + Vite 5 + Tailwind CSS v3 + React Router 6 + Supabase + lucide-react.

## Quick start (Android Termux, ARM64)

```bash
pkg update && pkg install nodejs-lts unzip -y
unzip realwood-furnishers-full-website.zip
cd realwood-furnishers
cp .env.example .env        # then edit .env (see below)
npm install
npm run build               # type-checks, then builds to ./dist
npm run dev                 # dev server on http://localhost:5173
npm run preview             # serve the production build on :4173
```

**Why this works on Termux:** no `@tailwindcss/vite`, no SWC, no Rust/native
compilation. Tailwind runs through plain PostCSS, and `@vitejs/plugin-react`
uses Babel. Vite 5's only native pieces (esbuild, rollup) ship prebuilt
Android/ARM64 binaries via npm. If `npm install` is ever interrupted, run
`rm -rf node_modules package-lock.json && npm install`.

The site runs **without Supabase** (sample catalogue; forms offer a WhatsApp
fallback). Connect Supabase to make products, forms and the admin live.

## 1. Business details (`.env`)

```
VITE_WHATSAPP_NUMBER=2547XXXXXXXX     # digits only, with country code
VITE_PHONE_NUMBER=+2547XXXXXXXX
VITE_CONTACT_EMAIL=                   # optional; hidden when blank
VITE_BUSINESS_HOURS=Mon - Sat: 8:00 AM - 6:00 PM
```

The defaults are **placeholders**. Replace them with Realwood's real number
and opening hours before going live.

## 2. Supabase setup

1. Create a project at supabase.com.
2. **SQL Editor** → paste and run `supabase/migrations/20261119000000_init.sql`.
   This creates the four tables, Row Level Security, two storage buckets
   (`product-images`, `request-references`) and eight starter categories.
3. **Project Settings → API**: copy the *Project URL* and the **anon / public**
   key into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   **Never** put the `service_role` key in this project.
4. **Authentication → Providers → Email**: turn **off** "Allow new users to
   sign up" so nobody can register themselves.
5. **Authentication → Users → Add user**: create the admin's email + password.
6. Make that user an admin (SQL Editor):

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
   where email = 'owner@example.com';
   ```

7. Visit `/admin`, sign in (sign out and in again if you were already signed in).

### How security works

- The browser only holds the public anon key. What anyone can do is decided by
  Row Level Security in the database, not by the frontend.
- Public visitors can: read categories and active products, **insert** enquiries
  and quote requests (length-checked), and upload one reference photo.
- Only users with `app_metadata.role = 'admin'` can read enquiries/requests or
  create/edit/delete products, categories and product images. `app_metadata`
  cannot be edited by users themselves.
- Forms include a honeypot field and server-side length constraints. For heavy
  spam, add Cloudflare Turnstile or hCaptcha in front of the forms later.
- Customer reference photos are stored in a public-URL bucket under random
  filenames; only the admin can list them.

## 3. Admin dashboard (`/admin`)

- **Products:** add / edit / delete, upload images to Supabase Storage,
  inline price editing, featured star, visible/hidden, made-to-order flag.
- **Categories:** add / edit / delete and sort order.
- **Enquiries:** contact-form messages with call / WhatsApp / email buttons and status.
- **Quote requests:** custom-furniture and upholstery/repair requests, budget,
  reference image, status.

## 4. Replace the placeholders before launch

| What | Where |
| --- | --- |
| Real phone / WhatsApp / hours | `.env` |
| Real products & photos | Admin dashboard (sample items are shown only when Supabase is not configured) |
| Real customer reviews | `src/data/testimonials` → `testimonials` in `src/data/content.ts` (cards show a "Sample review" tag until you remove `isSample`) |
| Real before/after photos | Put images in `public/showcase/` and pass `beforeSrc` / `afterSrc` to `<BeforeAfter />` in `Home.tsx` and `UpholsteryRepairs.tsx` |
| Colours / fonts | `tailwind.config.cjs`, `index.html` (Google Fonts) |
| Map pin | `mapsQuery` in `src/lib/config.ts` (use the exact workshop address) |

## 5. Deploying

`npm run build` outputs static files to `dist/`. Any static host works
(Netlify, Vercel, Cloudflare Pages, Firebase Hosting…). SPA rewrites are
included (`public/_redirects` for Netlify/Cloudflare, `vercel.json` for Vercel).
Set the same `VITE_*` variables in the host's environment settings.

## 6. M-Pesa readiness (not live)

No payment is simulated anywhere. `src/types/payments.ts` defines the Daraja
STK-push request/response/callback types and `src/services/payments.ts` is a
provider stub whose `isAvailable()` is `false`. Going live requires a secure
backend (e.g. Supabase Edge Functions) holding the Daraja consumer key/secret
and passkey, plus a callback endpoint writing to a `payments` table. The
steps are documented at the top of `payments.ts`.

## Project structure

```
src/
  components/      layout/ (Header, Footer, Layout), ProductCard, BeforeAfter, forms, ui
  data/            content.ts (services, copy), fallback.ts (sample catalogue)
  hooks/           useAsync, usePageTitle, useAdminSession
  lib/             supabase.ts, config.ts, utils.ts
  pages/           Home, Shop, ProductDetail, CustomFurniture, UpholsteryRepairs,
                   About, Contact, NotFound, admin/*
  services/        products, categories, enquiries, storage, auth, payments
  types/           index.ts, payments.ts
supabase/migrations/   SQL schema + RLS + storage
```
