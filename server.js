import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Config ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gft-admin-2024";

// ── Leads store (JSON file) ───────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function getLeads() {
  ensureDir();
  if (!existsSync(LEADS_FILE)) return [];
  try { return JSON.parse(readFileSync(LEADS_FILE, "utf-8")); }
  catch { return []; }
}

function saveLead(data) {
  const leads = getLeads();
  const lead = {
    ...data,
    id: Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(),
    createdAt: new Date().toISOString(),
    read: false,
    contacted: false,
  };
  leads.unshift(lead);
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  return lead;
}

function updateLead(id, patch) {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...patch };
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  return leads[idx];
}

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Admin auth middleware ──────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ── API routes ─────────────────────────────────────────────────────────────────

// Health check
app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Submit a new lead (contact form or booking request)
app.post("/api/leads", (req, res) => {
  const { name, phone, email, requestType, message, callback, source, booking } = req.body;

  if (!name || !phone || !requestType || !message) {
    return res.status(400).json({ error: "Missing required fields: name, phone, requestType, message" });
  }

  // Validate booking fields when source is booking_request
  if (source === "booking_request" && booking) {
    if (!booking.paymentType || !["private-pay", "insurance"].includes(booking.paymentType)) {
      return res.status(400).json({ error: "Invalid or missing booking.paymentType" });
    }
    if (booking.paymentType === "insurance" && !booking.insuranceId) {
      return res.status(400).json({ error: "Insurance Member ID required for insurance bookings" });
    }
  }

  const lead = saveLead({
    name,
    phone,
    email: email || "",
    requestType,
    message,
    callback: Boolean(callback),
    source: source || "contact_form",
    ...(booking && { booking }),
  });

  console.log(`[leads] New lead saved: ${lead.id} — ${name} (${source || "contact_form"})`);
  res.status(201).json({ id: lead.id });
});

// Admin: verify password
app.post("/api/admin/verify", (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: "Wrong password" });
  }
});

// Admin: list all leads
app.get("/api/leads", requireAdmin, (_req, res) => {
  res.json({ leads: getLeads() });
});

// Admin: update a lead (mark read/contacted)
app.patch("/api/leads/:id", requireAdmin, (req, res) => {
  const { read, contacted } = req.body || {};
  const updated = updateLead(req.params.id, { read, contacted });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ lead: updated });
});

// ── Serve static frontend ──────────────────────────────────────────────────────
const PUBLIC_DIR = path.join(__dirname, "public");
app.use(express.static(PUBLIC_DIR));

// SPA fallback — all non-API routes return index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Good Friend Transport server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
  console.log(`Admin password: ${ADMIN_PASSWORD === "gft-admin-2024" ? "gft-admin-2024 (default — change ADMIN_PASSWORD env var)" : "set via env"}`);
});
