import { useState, useEffect, useCallback } from "react";
import {
  Phone, Mail, MessageSquare, CheckCircle, Clock, RefreshCw,
  Eye, EyeOff, LogOut, Filter, User, PhoneCall
} from "lucide-react";

type BookingDetails = {
  paymentType?: string;
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

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  requestType: string;
  message: string;
  callback: boolean;
  source: string;
  booking?: BookingDetails;
  createdAt: string;
  read: boolean;
  contacted: boolean;
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function apiCall(path: string, method = "GET", password = "", body?: object) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-key": password },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export default function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("gft_admin_key") ?? "");
  const [showPw, setShowPw] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "booking" | "callback" | "contacted">("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeads = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const res = await apiCall("/leads", "GET", pw);
      if (res.status === 401) { setAuthed(false); sessionStorage.removeItem("gft_admin_key"); return; }
      const data = await res.json();
      setLeads(data.leads ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetch(`${BASE}/api/admin/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem("gft_admin_key", password);
      setAuthed(true);
      fetchLeads(password);
    } else {
      setAuthError("Incorrect password. Try again.");
    }
  };

  const patchLead = async (id: string, patch: Partial<Pick<Lead, "read" | "contacted">>) => {
    await apiCall(`/leads/${id}`, "PATCH", password, patch);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    if (selected?.id === id) setSelected((s) => s ? { ...s, ...patch } : s);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeads(password);
    setRefreshing(false);
  };

  useEffect(() => {
    if (password && sessionStorage.getItem("gft_admin_key") === password) {
      setAuthed(true);
      fetchLeads(password);
    }
  }, []);

  const filtered = leads.filter((l) => {
    if (filter === "unread") return !l.read;
    if (filter === "booking") return l.source === "booking_request";
    if (filter === "callback") return l.callback;
    if (filter === "contacted") return l.contacted;
    return true;
  });

  const bookingCount = leads.filter((l) => l.source === "booking_request").length;

  const unreadCount = leads.filter((l) => !l.read).length;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
              <User size={22} className="text-[#D4AF37]" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">Good Friend Transport Inc.</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-7 shadow-xl">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Admin Password
            </label>
            <div className="relative mb-5">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                data-testid="admin-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {authError && (
              <p className="text-red-500 text-xs mb-4 text-center" data-testid="admin-auth-error">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#0B0C10] py-3 rounded-xl font-bold text-sm hover:bg-[#f0cc60] transition-colors"
              data-testid="admin-login-btn"
            >
              Sign In
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              Default password: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">gft-admin-2024</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header bar */}
      <div className="bg-[#0B0C10] border-b border-[#D4AF37]/20 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg font-serif">Leads Inbox</h1>
            <p className="text-gray-500 text-xs">Good Friend Transport Inc. — Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2 text-gray-400 hover:text-[#D4AF37] transition-colors ${refreshing ? "animate-spin" : ""}`}
              title="Refresh"
              data-testid="admin-refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => { setAuthed(false); sessionStorage.removeItem("gft_admin_key"); }}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-xs transition-colors"
              data-testid="admin-logout"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Leads", value: leads.length, accent: false },
            { label: "Unread", value: unreadCount, accent: unreadCount > 0 },
            { label: "Callback Requests", value: leads.filter((l) => l.callback).length, accent: false },
            { label: "Contacted", value: leads.filter((l) => l.contacted).length, accent: false },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className={`text-2xl font-bold font-serif ${s.accent ? "text-[#D4AF37]" : "text-[#0B0C10]"}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Lead list */}
          <div className="lg:col-span-2">
            {/* Filter tabs */}
            <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 mb-3 shadow-sm flex-wrap">
              {(["all", "unread", "booking", "callback", "contacted"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? "bg-[#D4AF37] text-[#0B0C10]" : "text-gray-500 hover:text-[#0B0C10]"}`}
                  data-testid={`filter-${f}`}
                >
                  {f}
                  {f === "unread" && unreadCount > 0 && (
                    <span className={`ml-1 px-1 rounded-full text-[10px] ${filter === f ? "bg-[#0B0C10] text-[#D4AF37]" : "bg-[#D4AF37]/20 text-[#D4AF37]"}`}>
                      {unreadCount}
                    </span>
                  )}
                  {f === "booking" && bookingCount > 0 && (
                    <span className={`ml-1 px-1 rounded-full text-[10px] ${filter === f ? "bg-[#0B0C10] text-[#D4AF37]" : "bg-[#D4AF37]/20 text-[#D4AF37]"}`}>
                      {bookingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-400 shadow-sm" data-testid="no-leads">
                {leads.length === 0 ? "No leads yet. When visitors submit the contact form, they'll appear here." : "No leads match this filter."}
              </div>
            ) : (
              <div className="space-y-2" data-testid="leads-list">
                {filtered.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => { setSelected(lead); if (!lead.read) patchLead(lead.id, { read: true }); }}
                    className={`w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-all hover:border-[#D4AF37]/40 ${selected?.id === lead.id ? "border-[#D4AF37]" : "border-gray-100"}`}
                    data-testid={`lead-item-${lead.id}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${!lead.read ? "text-[#0B0C10]" : "text-gray-600"}`}>
                        {!lead.read && <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] mr-1.5 align-middle" />}
                        {lead.name}
                      </span>
                      <span className="text-xs text-gray-400">{timeAgo(lead.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {lead.source === "booking_request"
                        ? <span className="text-xs bg-[#D4AF37] text-[#0B0C10] px-2 py-0.5 rounded-full font-bold">🚐 Booking</span>
                        : <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{lead.requestType || "General"}</span>
                      }
                      {lead.callback && <span className="text-xs bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded-full font-semibold">Callback</span>}
                      {lead.contacted && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Contacted</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{lead.message}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail pane */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center h-64 text-gray-300">
                <MessageSquare size={32} className="mb-3" />
                <p className="text-sm">Select a lead to view details</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" data-testid="lead-detail">
                {/* Lead header */}
                <div className="bg-[#0B0C10] px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-white font-bold text-lg font-serif">{selected.name}</h2>
                      <p className="text-[#D4AF37] text-xs mt-0.5">{selected.requestType || "General Inquiry"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs">{formatDate(selected.createdAt)}</p>
                      <p className="text-gray-600 text-xs mt-0.5">ID: {selected.id}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Contact details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={`tel:${selected.phone.replace(/\D/g, "")}`}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-[#D4AF37]/5 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                        <Phone size={15} className="text-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-semibold text-[#0B0C10] group-hover:text-[#D4AF37] transition-colors">{selected.phone}</p>
                      </div>
                    </a>
                    {selected.email ? (
                      <a
                        href={`mailto:${selected.email}`}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-[#D4AF37]/5 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                          <Mail size={15} className="text-[#D4AF37]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm font-semibold text-[#0B0C10] group-hover:text-[#D4AF37] transition-colors break-all">{selected.email}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 opacity-40">
                        <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Mail size={15} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm text-gray-400">Not provided</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {selected.callback && (
                      <div className="flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold px-3 py-1.5 rounded-full">
                        <PhoneCall size={12} /> Callback Requested
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
                      <Clock size={12} /> {formatDate(selected.createdAt)}
                    </div>
                  </div>

                  {/* Booking trip details */}
                  {selected.booking && (
                    <div className="border-2 border-[#D4AF37]/30 rounded-xl overflow-hidden">
                      <div className="bg-[#0B0C10] px-4 py-3 flex items-center gap-2">
                        <span className="text-[#D4AF37] text-sm font-bold">🚐 Trip Details</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {[
                          { label: "Pickup", value: [selected.booking.pickupAddress, selected.booking.pickupUnit].filter(Boolean).join(", ") },
                          { label: "Drop-off", value: [selected.booking.dropoffAddress, selected.booking.facilityName].filter(Boolean).join(" — ") },
                          { label: "Date", value: selected.booking.date ? new Date(selected.booking.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : "—" },
                          { label: "Pickup Time", value: selected.booking.pickupTime },
                          { label: "Trip Type", value: { "one-way": "One-Way", "round-trip": "Round-Trip", recurring: "Recurring Weekly" }[selected.booking.tripType] ?? selected.booking.tripType },
                          ...(selected.booking.returnTime ? [{ label: "Return Time", value: selected.booking.returnTime }] : []),
                          { label: "Transport", value: { ambulatory: "Standard Ambulatory", "wheelchair-own": "Wheelchair (Own)", "wheelchair-provided": "Wheelchair (Van-Provided)", stretcher: "Stretcher / Gurney" }[selected.booking.assistanceType] ?? selected.booking.assistanceType },
                          { label: "Oxygen", value: selected.booking.oxygenTank ? "Yes — required" : "No" },
                          { label: "Companions", value: selected.booking.companions === "0" ? "None" : `${selected.booking.companions} companion(s)` },
                          { label: "Passenger", value: selected.booking.passengerName + (selected.booking.passengerDob ? ` (DOB: ${selected.booking.passengerDob})` : "") },
                          { label: "Relationship", value: { self: "Self", child: "Child / Family", "case-manager": "Case Manager", "facility-coordinator": "Facility Coordinator" }[selected.booking.relationship] ?? selected.booking.relationship },
                          { label: "Payment", value: selected.booking.paymentType === "insurance" ? "🏥 Insurance Covered" : selected.booking.paymentType === "private-pay" ? "💳 Private Pay" : (selected.booking.paymentType ?? "—") },
                          ...(selected.booking.insuranceId ? [{ label: "Insurance ID", value: selected.booking.insuranceId }] : []),
                        ].map((row) => (
                          <div key={row.label} className="flex px-4 py-2.5 gap-3">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-24 flex-shrink-0 pt-0.5">{row.label}</div>
                            <div className="text-sm text-[#0B0C10] font-medium break-words flex-1">{row.value || "—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      {selected.source === "booking_request" ? "Booking Summary" : "Message"}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => patchLead(selected.id, { contacted: !selected.contacted })}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${selected.contacted ? "bg-green-100 text-green-700 border-2 border-green-200" : "bg-[#D4AF37] text-[#0B0C10] hover:bg-[#f0cc60]"}`}
                      data-testid="mark-contacted-btn"
                    >
                      <CheckCircle size={15} />
                      {selected.contacted ? "✓ Marked as Contacted" : "Mark as Contacted"}
                    </button>
                    <button
                      onClick={() => patchLead(selected.id, { read: !selected.read })}
                      className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 transition-colors"
                      data-testid="toggle-read-btn"
                    >
                      {selected.read ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <a
                      href={`tel:${selected.phone.replace(/\D/g, "")}`}
                      className="px-4 py-2.5 rounded-xl border-2 border-[#D4AF37]/30 text-[#D4AF37] text-sm font-semibold hover:border-[#D4AF37] transition-colors"
                    >
                      <Phone size={15} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
