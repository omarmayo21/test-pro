# Mohamed Ashraf — Portfolio

A bespoke, editorial portfolio for Mohamed Ashraf (Senior Graphic Designer), built with React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, and a lightweight native 3D WebGL ambient sculpture.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

---

## Vercel Deployment

The project is fully preconfigured for **zero-configuration GitHub → Vercel** deployments:

1. **Push** this repository to your GitHub account.
2. **Import** the repository in your [Vercel Dashboard](https://vercel.com/new).
3. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**.

`vercel.json` is included to provide optimized asset caching headers, strict security headers, and clean single-page application (SPA) routing with a custom branded 404 page.

---

## Production Features & Optimizations

- **3D / WebGL Ambient Experience**: Zero-dependency lightweight WebGL kinetic sculpture in the hero section with automatic WebGL availability detection, context loss recovery, `prefers-reduced-motion` compliance, mobile performance throttling, and React lazy loading / Suspense fallback.
- **Production SEO & Structured Data**: Comprehensive Open Graph and Twitter card meta tags, Schema.org JSON-LD structured data (`Person` & `WebSite`), canonical URL, dynamic meta description, and Google Fonts preconnection.
- **Search Engine Discovery**: Ready-to-serve `/robots.txt` and `/sitemap.xml`.
- **Branding Assets**: Custom SVG favicon (`/favicon.svg`), `.ico` fallback, Apple Touch icon, and high-resolution Open Graph banner (`/og-image.jpg`).
- **Resilience & 404 Handling**: Dedicated branded 404 error page matching the editorial identity, wrapped in a global React `ErrorBoundary` to prevent catastrophic crashes.
- **Static Assets**: 30 responsive WebP images (`480w`, `800w`, `1200w`, `1536w`) and downloadable portfolio PDF (`/mohamed-ashraf-portfolio.pdf`).

---

## Content & Settings

- **Project Data**: [`src/data/projects.ts`](file:///d:/front%20end%20dev/ash/src/data/projects.ts)
- **Profile, Metrics, Services, Contact**: [`src/data/site.ts`](file:///d:/front%20end%20dev/ash/src/data/site.ts)
- **Static Assets & Images**: [`public/images/`](file:///d:/front%20end%20dev/ash/public/images)
- **Environment Variables**: [`.env.example`](file:///d:/front%20end%20dev/ash/.env.example)
