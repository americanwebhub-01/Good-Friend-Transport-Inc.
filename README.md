# Good Friend Transportation Inc. — Hostinger Deployment

## Setup

1. Upload the contents of this folder to your Hostinger Node.js hosting root.
2. In Hostinger's Node.js app panel, set the **entry point** to `server.js`.
3. Set the **Node.js version** to 18+ (20 LTS recommended).
4. Install dependencies:
   ```
   npm install
   ```
5. Start the app:
   ```
   npm start
   ```

## Environment Variables

Set these in Hostinger's environment variables panel:

| Variable         | Default          | Description                              |
|------------------|------------------|------------------------------------------|
| `PORT`           | `3000`           | Port the server listens on (Hostinger sets this automatically) |
| `ADMIN_PASSWORD` | `gft-admin-2024` | **Change this** — password for /admin panel |

## Admin Panel

Visit `/admin` on your live site and sign in with your `ADMIN_PASSWORD`.
All contact-form submissions appear here as leads you can mark read/contacted.

## Lead Storage

Lead data is stored in `data/leads.json` — a plain JSON file on your server disk.
No database required.

## File Structure

```
server.js          ← Express server (API + static file serving)
package.json       ← Runtime dependencies (express only)
data/              ← Auto-created; stores leads.json
public/            ← Built React frontend (static files)
  index.html
  assets/
  hero-van.png
  logo.png
  favicon.svg
  opengraph.jpg
  robots.txt
```

## Updating the Admin Password

Set the `ADMIN_PASSWORD` environment variable in Hostinger before starting the server.
The default `gft-admin-2024` is shown on the login screen — change it for production.
