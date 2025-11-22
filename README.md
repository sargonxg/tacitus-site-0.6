# Tacitus · Conflict & Polarization Intelligence

This repo contains a single-page React app for Tacitus:

- **Conflict Engine**: multi-pipeline OSINT + email-native RAG for live conflict intelligence.
- **Prism Lab**: polarization and campaign analysis tool that searches for common ground across polarized blocs.
- **Deep Analysis**: examples of Tacitus' conflict ontology and computed resolution options.
- **Concordia Discors Magazine**: sister project exploring polarization, conflict, and AI from a philosophical perspective.

## Local Development

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Build

```bash
npm run build
```

This produces a static bundle in `dist/`.

## Deploying on Cloudflare Pages

1. Push this folder as a GitHub repository.
2. In Cloudflare Pages, click **Create a project** → **Connect to Git** and select the repo.
3. Use these settings:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Deploy. Cloudflare will run the build and serve `dist/` as the site.
