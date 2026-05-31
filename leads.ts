import { Router } from "express";
import { z } from "zod/v4";
import { getLeads, saveLead, updateLead } from "../lib/leads-store.js";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "gft-admin-2024";

const BookingData = z.object({
  paymentType: z.enum(["private-pay", "insurance"]),
  insuranceId: z.string().optional(),
  pickupAddress: z.string().min(1),
  pickupUnit: z.string().optional(),
  dropoffAddress: z.string().min(1),
  facilityName: z.string().optional(),
  date: z.string().min(1),
  pickupTime: z.string().min(1),
  tripType: z.string().min(1),
  returnTime: z.string().optional(),
  assistanceType: z.string().min(1),
  oxygenTank: z.boolean(),
  companions: z.string(),
  passengerName: z.string().min(1),
  passengerDob: z.string().optional(),
  relationship: z.string().min(1),
});

const LeadInput = z.object({
  name: z.string().min(1, "Name required"),
  phone: z.string().min(1, "Phone required"),
  email: z.string().optional().default(""),
  requestType: z.string().min(1, "Request type required"),
  message: z.string().min(1, "Message required"),
  callback: z.boolean().default(false),
  source: z.string().default("contact_form"),
  booking: BookingData.optional(),
});

function requireAdmin(req: any, res: any, next: any) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.post("/leads", (req, res) => {
  const result = LeadInput.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid input", issues: result.error.issues });
    return;
  }
  const lead = saveLead(result.data);
  req.log.info({ leadId: lead.id }, "New lead saved");
  res.status(201).json({ id: lead.id });
});

router.post("/admin/verify", (req, res) => {
  const { password } = req.body ?? {};
  if (password === ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: "Wrong password" });
  }
});

router.get("/leads", requireAdmin, (_req, res) => {
  res.json({ leads: getLeads() });
});

router.patch("/leads/:id", requireAdmin, (req, res) => {
  const { read, contacted } = req.body ?? {};
  const updated = updateLead(req.params.id, { read, contacted });
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ lead: updated });
});

export default router;
