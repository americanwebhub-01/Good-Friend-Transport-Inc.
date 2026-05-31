import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export type BookingDetails = {
  paymentType: "private-pay" | "insurance" | string;
  insuranceId?: string;
  pickupAddress: string;
  pickupUnit?: string;
  dropoffAddress: string;
  facilityName?: string;
  date: string;
  pickupTime: string;
  tripType: string;
  returnTime?: string;
  assistanceType: string;
  oxygenTank: boolean;
  companions: string;
  passengerName: string;
  passengerDob?: string;
  relationship: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  requestType: string;
  message: string;
  callback: boolean;
  source: "contact_form" | "booking_request" | string;
  booking?: BookingDetails;
  createdAt: string;
  read: boolean;
  contacted: boolean;
};

const DATA_DIR = join(process.cwd(), "data");
const LEADS_FILE = join(DATA_DIR, "leads.json");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function getLeads(): Lead[] {
  ensureDir();
  if (!existsSync(LEADS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(LEADS_FILE, "utf-8")) as Lead[];
  } catch {
    return [];
  }
}

export function saveLead(data: Omit<Lead, "id" | "createdAt" | "read" | "contacted">): Lead {
  const leads = getLeads();
  const lead: Lead = {
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

export function updateLead(id: string, patch: Partial<Pick<Lead, "read" | "contacted">>): Lead | null {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...patch };
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  return leads[idx];
}
