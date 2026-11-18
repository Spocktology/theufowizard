# DNS Cutover — theufowizard.com + satorufo.com → Cloudflare Pages

## What's done

- ✅ Astro site built (10 pages: 6 static + 4 iframe wrappers)
- ✅ Deployed to Cloudflare Pages: https://theufowizard.pages.dev
- ✅ Code on GitHub: https://github.com/Spocktology/theufowizard
- ✅ satorufo.com 301 redirect middleware included (functions/_middleware.ts)
- ✅ No email on either domain (no MX records to preserve)

## Current state

| Domain | DNS/NS | Hosting | IP |
|---|---|---|---|
| theufowizard.com | Zoho (ns11/21/31/41.zns-53.com/.net) | Zoho Sites | 136.143.185.12 |
| satorufo.com | Zoho (same) | Zoho Sites | 136.143.185.12 |

## Cutover steps

### 1. Add both domains to Cloudflare

1. Cloudflare dashboard → **Add a site** → `theufowizard.com` → **Free plan**
2. Cloudflare dashboard → **Add a site** → `satorufo.com` → **Free plan**
3. Cloudflare will scan existing DNS records. Verify none are mail-related (there shouldn't be).

### 2. Get Cloudflare nameservers

For each domain, Cloudflare will show two nameservers like:
- `xxx.ns.cloudflare.com`
- `yyy.ns.cloudflare.com`

Note both sets (they may differ per domain).

### 3. Change nameservers at Zoho Domains

1. Log in to Zoho Domains (domains.zoho.com or zoho.com/domains)
2. For `theufowizard.com`: replace the 4 Zoho nameservers with the 2 Cloudflare nameservers
3. For `satorufo.com`: same — replace with that domain's Cloudflare nameservers
4. Save. Propagation is usually minutes–hours.

### 4. Add custom domains to the Pages project

Once the zones are active in Cloudflare (nameservers changed):

1. Cloudflare dashboard → **Workers & Pages** → `theufowizard` → **Custom domains** → **Set up a custom domain**
2. Add `theufowizard.com` → Cloudflare creates the CNAME automatically
3. Add `www.theufowizard.com` → same
4. Add `satorufo.com` → same project (the middleware will 301 redirect to theufowizard.com/sat-or-ufo)
5. Add `www.satorufo.com` → same

### 5. Connect GitHub for automatic deploys (optional but recommended)

1. Cloudflare dashboard → **Workers & Pages** → `theufowizard` → **Settings** → **Build & deployments**
2. Connect the GitHub repo `Spocktology/theufowizard`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set production branch: `main`

After this, every push to `main` auto-deploys. No more `npx wrangler pages deploy` needed.

### 6. Verify

- [ ] https://www.theufowizard.com loads the new site
- [ ] https://www.theufowizard.com/sat-flare-checker loads the iframe tool
- [ ] https://www.theufowizard.com/sat-or-ufo loads the iframe tool
- [ ] https://www.theufowizard.com/evidence-lab loads the iframe tool
- [ ] https://www.theufowizard.com/ufo-disclosure-timeline loads the iframe tool
- [ ] https://satorufo.com 301-redirects to https://www.theufowizard.com/sat-or-ufo
- [ ] All static pages load (About, Research, Contact, Speaking, Press Kit)
- [ ] Sitemap at https://www.theufowizard.com/sitemap-index.xml

## Deploy manually (until GitHub integration is set up)

```bash
cd ~/theufowizard
npm run build
npx wrangler pages deploy dist --project-name theufowizard
```
