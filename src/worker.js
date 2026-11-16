/**
 * Amapiano Is Here — Cloudflare Worker
 *
 * Serves the static site from /public and handles the sign-up form at POST /api/subscribe,
 * forwarding each sign-up to a webhook of your choice (Zapier, Make, Airtable, Cymbal, etc.).
 *
 * Setup in Cloudflare: Workers & Pages → amapiano-is-here → Settings → Variables and Secrets
 *   WEBHOOK_URL   (required to actually store sign-ups) e.g. https://hooks.zapier.com/hooks/catch/...
 *   WEBHOOK_TOKEN (optional) sent as "Authorization: Bearer <token>"
 *
 * Without WEBHOOK_URL the form still returns success so the site works in testing,
 * and logs the sign-up (visible in the Worker's Logs tab).
 */

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function handleSubscribe(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Send the form as JSON." }, 400);
  }

  // Honeypot: real people never fill this hidden field
  if (data.company) return json({ ok: true });

  const name = String(data.name || "").trim().slice(0, 80);
  const email = String(data.email || "").trim().toLowerCase().slice(0, 160);
  const phoneDigits = String(data.phone || "").replace(/\D/g, "").replace(/^1/, "");

  if (!name) return json({ ok: false, error: "Name is required." }, 422);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "Email is not valid." }, 422);
  if (phoneDigits && phoneDigits.length !== 10) return json({ ok: false, error: "Phone must be 10 digits." }, 422);

  const record = {
    name,
    email,
    phone: phoneDigits ? `+1${phoneDigits}` : "",
    city: String(data.city || "").slice(0, 40),
    interests: Array.isArray(data.interests) ? data.interests.slice(0, 5).map(String) : [],
    list: String(data.list || "aih-2027-interest").slice(0, 60),
    message: String(data.message || "").slice(0, 1500),
    sms_consent: Boolean(data.sms_consent) && Boolean(phoneDigits),
    source: "amapianoishere.com",
    submitted_at: new Date().toISOString(),
    country: request.cf && request.cf.country ? request.cf.country : ""
  };

  if (!env.WEBHOOK_URL) {
    console.log("AIH sign-up (no WEBHOOK_URL set):", JSON.stringify(record));
    return json({ ok: true, stored: false });
  }

  try {
    const headers = { "Content-Type": "application/json" };
    if (env.WEBHOOK_TOKEN) headers.Authorization = `Bearer ${env.WEBHOOK_TOKEN}`;
    const res = await fetch(env.WEBHOOK_URL, { method: "POST", headers, body: JSON.stringify(record) });
    if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
    return json({ ok: true, stored: true });
  } catch (err) {
    console.error("AIH sign-up webhook failed:", err.message, JSON.stringify(record));
    return json({ ok: false, error: "Could not save right now." }, 502);
  }
}


export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/subscribe") {
      if (request.method === "POST") return handleSubscribe(request, env);
      return json({ ok: false, error: "Use POST." }, 405);
    }
    return env.ASSETS.fetch(request);
  }
};
