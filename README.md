# Resolution & Seeders Add-on for Stremio

This add‑on pipes through external stream sources (e.g. Torrentio, MediaFusion) and shows only each source’s:
- **Resolution** (e.g. 4K, 1080P, 720P)
- **Connection** (Available / Unavailable based on seeders >1)

## Files
- `addon.js` : main logic & Vercel handler
- `package.json` : deps, CommonJS config
- `vercel.json` : build & routing for Vercel
- `.gitignore`
- `README.md`

## Setup & Deployment

1. **Clone repo**
   ```bash
   git clone https://github.com/<your‑user>/stremio-resolution-seeders-addon.git
   cd stremio-resolution-seeders-addon
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set external sources** (optional via ENV)
   ```bash
   export EXTERNAL_STREAM_SOURCES="https://api.strem.io/catalog/torrentio/stream,https://..."
   ```
4. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add error handling & CommonJS"
   git push
   ```
5. **Import & deploy on Vercel**
   - Go to Vercel, import this repo.
   - No build command needed; uses `vercel.json`.
   - In Vercel ENV, set `EXTERNAL_STREAM_SOURCES` if desired.

6. **Register in Stremio**
   - Add manifest URL:
     ```
     https://<your-vercel-domain>/manifest.json
     ```

## Debugging
- Check Vercel **Function Logs** in the dashboard for `Incoming GET /manifest.json` or errors.
- Ensure `node-fetch` is installed and `type: "commonjs"` is set.
