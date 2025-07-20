# Resolution & Seeders Add-on for Stremio

This add‑on fetches external stream sources (e.g. Torrentio, MediaFusion) and displays only the resolution and connection status.

## Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your‑user>/stremio-resolution-seeders-addon.git
   cd stremio-resolution-seeders-addon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy to Vercel** (or run locally)
   ```bash
   npm start
   ```

4. **Add to Stremio**
   - Open Stremio → Add‑ons → “+” → “Add URL”
   - Enter: `https://<your‑vercel‑domain>/manifest.json`

## Configuration
- To point at different plugins, update the `EXTERNAL_STREAM_SOURCES` array in `addon.js`.
- You can also load endpoints from environment variables if preferred.
