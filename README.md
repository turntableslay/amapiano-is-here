# Amapiano Is Here — 2027 sign-up page

A single page with one job: collect emails and mobile numbers for 2027 events.
Plain HTML, CSS and JavaScript, hosted as a Cloudflare Worker deployed from GitHub. Deploy steps are further down.

## What's on the page

1. **Hero:** full-bleed crowd photo, the logo, "See you in 2027." and the sign-up form, all in the first screen.
2. **Photo wall:** counter-scrolling rows of event photos and a clip. Tap to open any photo.
3. **Anniversary note:** the 4th anniversary message, with a button back to the form.
4. **Who's played the room:** scrolling name rows (social proof).
5. **Playlist:** Spotify embed and follow button.
6. **Closing call:** one more button back to the form.

On phones, a "Get on the 2027 list" bar sticks to the bottom once the form is off screen.

## Edit the content

Everything is in **`public/js/config.js`**: links, Spotify playlist, form endpoint, the list tag, the names, and the photo wall.
Every sign-up is sent with `list: "aih-2027-interest"` so you can segment it in your CRM.

## Project layout

```
amapiano-is-here/
├── public/                 ← the website (everything visitors see)
│   ├── index.html
│   ├── 404.html
│   ├── css/style.css
│   ├── js/config.js        ← ★ all editable content
│   ├── js/main.js
│   ├── assets/             ← logo, photos, clips, favicon, share image
│   ├── _headers            ← security + caching rules
│   └── robots.txt
├── src/worker.js           ← handles the sign-up form (POST /api/subscribe)
└── wrangler.jsonc          ← Cloudflare settings
```

## Put it on GitHub

Upload **everything inside the `amapiano-is-here` folder** to the top of the repo: `public/`, `src/`, `wrangler.jsonc`,
`README.md` and `.gitignore`. On the repo's front page you should see `wrangler.jsonc` and the `public` folder.

If the repo already has the old version, delete the old top-level `index.html`, `404.html`, `css`, `js`, `assets`,
`functions`, `_headers` and `robots.txt` first, so they don't sit next to the new `public/` folder.

## Deploy on Cloudflare (Workers)

This is set up as a **Worker**, which matches the project you created (deploy command `npx wrangler deploy`).

1. Make sure the `"name"` in `wrangler.jsonc` matches your Worker's name in the Cloudflare dashboard
   (it's set to `amapiano-is-here`). If yours is different, change that one line.
2. Build settings: build command empty, deploy command `npx wrangler deploy`. Push to GitHub and it deploys.

## Make the sign-up form save people

1. Create a webhook that receives JSON, e.g. **Zapier → Webhooks by Zapier → Catch Hook**, then send it to Google Sheets, Airtable, Cymbal or HubSpot.
2. In Cloudflare: **Workers & Pages → your Worker → Settings → Variables and Secrets → Add**:
   - `WEBHOOK_URL` = the webhook URL (choose **Secret**)
   - `WEBHOOK_TOKEN` = optional, sent as `Authorization: Bearer …`
3. Redeploy (or push any change).

Each sign-up sends: `name, email, phone (+1…), city, list ("aih-2027-interest"), sms_consent, source, submitted_at, country`.
Without `WEBHOOK_URL`, the form still shows success but sign-ups only appear in the Worker's **Logs** tab.

## Custom domain

Your Worker → **Settings → Domains & Routes → Add → Custom domain** → `amapianoishere.com` (the domain must be on your Cloudflare account).

## Test locally (optional)

```bash
npx wrangler dev
```
Then open http://localhost:8787.

## Adding photos

Photos live in `public/assets/photos/` in two sizes each: `<name>-800.jpg` and `<name>-1600.jpg` (JPEG, quality ~75).
Clips live in `public/assets/clips/` (MP4, muted, with a `.jpg` poster frame).
Add a photo to the `gallery` list in `public/js/config.js` as `{ photo: "<name>", w, h, alt }`, where `w`/`h` is the 800px file's size.
