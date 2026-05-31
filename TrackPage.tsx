import { useState, useEffect } from "react";
import {
  CheckCircle, Clock, MapPin, Phone, Car, User,
  Share2, ArrowRight, Search, Loader2, RefreshCw,
  ChevronRight, Shield
} from "lucide-react";

const STATUSES = [
  { id: "confirmed",    label: "Booking Confirmed",      desc: "Your reservation has been received and confirmed by our dispatch team." },
  { id: "assigned",     label: "Driver Assigned",         desc: "A certified driver has been assigned to your trip and is preparing for pickup." },
  { id: "en-route",     label: "Driver En Route",         desc: "Your driver is on the way to your pickup location. Please be ready at your door." },
  { id: "arrived",      label: "Driver Arrived",          desc: "Your driver has arrived at your pickup location and is assisting you to the vehicle." },
  { id: "in-progress",  label: "Trip In Progress",        desc: "You're on your way! Sit back and relax — your driver is taking you safely to your destination." },
  { id: "completed",    label: "Trip Completed",          desc: "You have arrived safely at your destination. Thank you for choosing Good Friend Transport." },
] as const;

type StatusId = typeof STATUSES[number]["id"];

const MOCK_DRIVERS = [
  { name: "Marcus J.", vehicle: "2023 Ford Transit", plate: "GA-NEMT-4821", phone: "770-555-0192", rating: "5.0" },
  { name: "Darnell W.", vehicle: "2022 Chrysler Pacifica", plate: "GA-NEMT-3374", phone: "770-555-0147", rating: "4.9" },
  { name: "Tonya R.", vehicle: "2023 Dodge Grand Caravan", plate: "GA-NEMT-6612", phone: "770-555-0283", rating: "5.0" },
];

function deriveStatus(trackingId: string): StatusId {
  const idx = trackingId.charCodeAt(4) % STATUSES.length;
  return STATUSES[idx].id;
}

function deriveMockTrip(trackingId: string) {
  const d = trackingId.charCodeAt(5) % MOCK_DRIVERS.length;
  const driver = MOCK_DRIVERS[d];
  const statusId = deriveStatus(trackingId);
  const statusIndex = STATUSES.findIndex(s => s.id === statusId);

  const destinations = [
    { pickup: "412 Magnolia Ave, Atlanta, GA 30310", dropoff: "Emory Dialysis Center, 1365 Clifton Rd NE, Atlanta" },
    { pickup: "88 Peachtree Hills Ave, Atlanta, GA 30305", dropoff: "Piedmont Hospital, 1968 Peachtree Rd NW, Atlanta" },
    { pickup: "2201 West Oak Pkwy, Marietta, GA 30064", dropoff: "WellStar Kennestone, 677 Church St, Marietta" },
  ];
  const dest = destinations[d];

  const times = ["8:30 AM", "10:15 AM", "1:45 PM", "3:00 PM"];
  const pickupTime = times[trackingId.charCodeAt(6) % times.length];

  return { driver, statusId, statusIndex, dest, pickupTime };
}

function StatusTimeline({ currentId }: { currentId: StatusId }) {
  const currentIndex = STATUSES.findIndex(s => s.id === currentId);

  return (
    <div className="relative" data-testid="status-timeline">
      {STATUSES.map((status, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const pending = i > currentIndex;

        return (
          <div key={status.id} className="flex gap-4 mb-0">
            {/* Spine */}
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                done    ? "bg-[#D4AF37] text-[#0B0C10]" :
                active  ? "bg-[#D4AF37] text-[#0B0C10] ring-4 ring-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.5)]" :
                          "bg-gray-100 text-gray-400"
              }`}>
                {done ? <CheckCircle size={16} /> : active ? <div className="w-3 h-3 rounded-full bg-[#0B0C10] animate-pulse" /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />}
              </div>
              {i < STATUSES.length - 1 && (
                <div className={`w-0.5 h-10 transition-all duration-700 ${done ? "bg-[#D4AF37]" : "bg-gray-200"}`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 flex-1 ${i === STATUSES.length - 1 ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2 mt-1.5">
                <p className={`font-semibold text-sm ${active ? "text-[#0B0C10]" : done ? "text-gray-600" : "text-gray-400"}`}>
                  {status.label}
                </p>
                {active && (
                  <span className="px-2 py-0.5 bg-[#D4AF37] text-[#0B0C10] text-xs font-bold rounded-full uppercase tracking-wide">
                    Current
                  </span>
                )}
              </div>
              {(active || done) && (
                <p className={`text-xs mt-0.5 leading-relaxed ${active ? "text-gray-600" : "text-gray-400"}`}>
                  {status.desc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TripCard({ trackingId }: { trackingId: string }) {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const { driver, statusId, statusIndex, dest, pickupTime } = deriveMockTrip(trackingId);
  const currentStatus = STATUSES.find(s => s.id === statusId)!;
  const isEnRoute = statusId === "en-route";
  const isArrived = statusId === "arrived" || statusId === "in-progress";
  const isCompleted = statusId === "completed";

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setLastRefresh(new Date()); }, 1200);
  };

  const handleShare = () => {
    const text = `Track my Good Friend Transport ride: ID ${trackingId}\nStatus: ${currentStatus.label}`;
    if (navigator.share) {
      navigator.share({ title: "Track My NEMT Ride", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const etaMinutes = isEnRoute ? 12 : isArrived ? 0 : null;

  return (
    <div className="space-y-5" data-testid="trip-card">
      {/* Status Hero */}
      <div className={`rounded-2xl p-6 text-center border-2 ${
        isCompleted ? "bg-green-50 border-green-200" : "bg-[#D4AF37]/5 border-[#D4AF37]/25"
      }`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
          isCompleted ? "bg-green-100" : "bg-[#D4AF37]/15"
        }`}>
          {isCompleted
            ? <CheckCircle size={32} className="text-green-600" />
            : isEnRoute
              ? <Car size={32} className="text-[#D4AF37]" />
              : <Clock size={32} className="text-[#D4AF37]" />
          }
        </div>
        <p className="font-serif font-bold text-xl text-[#0B0C10] mb-1">{currentStatus.label}</p>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">{currentStatus.desc}</p>
        {etaMinutes !== null && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-[#D4AF37] text-[#0B0C10] px-4 py-1.5 rounded-full text-sm font-bold">
            <Clock size={14} />
            Arriving in approx. {etaMinutes} minutes
          </div>
        )}
      </div>

      {/* Progress: X of 6 steps */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] rounded-full transition-all duration-700"
            style={{ width: `${((statusIndex + 1) / STATUSES.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 font-medium flex-shrink-0">
          Step {statusIndex + 1} of {STATUSES.length}
        </span>
      </div>

      {/* Driver Card — show once assigned */}
      {statusIndex >= 1 && (
        <div className="bg-[#0B0C10] rounded-xl p-5" data-testid="driver-card">
          <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">Your Driver</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
              <User size={22} className="text-[#D4AF37]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold">{driver.name}</p>
              <p className="text-gray-400 text-xs">{driver.vehicle}</p>
              <p className="text-gray-500 text-xs">Plate: {driver.plate}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[#D4AF37] font-bold text-sm">★ {driver.rating}</div>
              <p className="text-gray-500 text-xs">Rating</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
            <a
              href={`tel:${driver.phone.replace(/-/g, "")}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#D4AF37] text-[#0B0C10] py-2.5 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors"
              data-testid="call-driver-btn"
            >
              <Phone size={14} /> Call Driver
            </a>
            <a
              href="tel:7706294653"
              className="flex-1 flex items-center justify-center gap-1.5 border border-white/20 text-gray-300 py-2.5 rounded-lg font-semibold text-sm hover:border-[#D4AF37]/50 hover:text-white transition-colors"
              data-testid="call-dispatch-btn"
            >
              <Phone size={14} /> Dispatch
            </a>
          </div>
        </div>
      )}

      {/* Trip Details */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Trip Details</p>
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center mt-1 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <div className="w-px h-8 bg-gray-300 my-1" />
            <MapPin size={12} className="text-red-500" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Pickup</p>
              <p className="text-sm font-medium text-[#0B0C10]">{dest.pickup}</p>
              <p className="text-xs text-[#D4AF37] font-medium mt-0.5">Scheduled: {pickupTime}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Drop-off</p>
              <p className="text-sm font-medium text-[#0B0C10]">{dest.dropoff}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Status Timeline</p>
        <StatusTimeline currentId={statusId} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 border-2 border-[#D4AF37]/40 text-[#D4AF37] px-4 py-2.5 rounded-lg font-semibold text-sm hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all disabled:opacity-50"
          data-testid="refresh-btn"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg font-semibold text-sm hover:border-gray-400 transition-colors"
          data-testid="share-btn"
        >
          <Share2 size={14} /> Share with Family
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Last updated: {lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}

export default function TrackPage() {
  const params = new URLSearchParams(window.location.search);
  const prefilledId = params.get("id") ?? "";

  const isValidPrefill = prefilledId.startsWith("GFT-") && prefilledId.length >= 8;
  const [inputId, setInputId] = useState(prefilledId);
  const [activeId, setActiveId] = useState(isValidPrefill ? prefilledId : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {}, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputId.trim().toUpperCase();
    if (!clean.startsWith("GFT-") || clean.length < 8) {
      setError("Please enter a valid tracking ID (format: GFT-XXXXXXXX).");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => { setActiveId(clean); setLoading(false); }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-[#0B0C10] py-12 border-b-4 border-[#D4AF37]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2" data-testid="track-page-title">
            Track Your Ride
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your booking ID to see real-time status updates and driver details.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Search bar */}
        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={inputId}
                onChange={e => { setInputId(e.target.value.toUpperCase()); setError(""); }}
                placeholder="GFT-XXXXXXXX"
                className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm font-mono focus:border-[#D4AF37] focus:outline-none transition-colors bg-white tracking-widest"
                aria-label="Tracking ID"
                data-testid="tracking-id-input"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#f0cc60] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.25)] flex-shrink-0"
              data-testid="track-submit-btn"
            >
              Track <ArrowRight size={15} />
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2 ml-1" data-testid="track-error">{error}</p>}
          <p className="text-xs text-gray-400 mt-2 ml-1">Your tracking ID was provided on your booking confirmation screen.</p>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16" data-testid="track-loading">
            <Loader2 size={36} className="text-[#D4AF37] animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Looking up your trip…</p>
          </div>
        )}

        {/* Results */}
        {!loading && activeId && <TripCard trackingId={activeId} />}

        {/* Empty state */}
        {!loading && !activeId && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
              <Car size={28} className="text-[#D4AF37]" />
            </div>
            <h2 className="font-serif font-bold text-xl text-[#0B0C10] mb-2">Enter Your Tracking ID</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
              Your unique GFT tracking ID was shown on the booking confirmation screen. It looks like <span className="font-mono font-semibold">GFT-AB3D7K9X</span>.
            </p>
            <div className="bg-white border border-gray-100 rounded-xl p-5 max-w-sm mx-auto text-left">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Try a demo ID</p>
              {["GFT-AB3D7K9X", "GFT-MN2Q4R8T", "GFT-ZP5W1F6Y"].map(id => (
                <button
                  key={id}
                  onClick={() => { setInputId(id); setLoading(true); setTimeout(() => { setActiveId(id); setLoading(false); }, 800); }}
                  className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg hover:bg-[#D4AF37]/5 transition-colors group"
                  data-testid={`demo-id-${id}`}
                >
                  <span className="font-mono text-sm text-[#0B0C10] font-medium">{id}</span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trust badge */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield size={13} className="text-[#D4AF37]" />
          <span>Trip data is private and only accessible with your unique booking ID.</span>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Need help?{" "}
          <a href="tel:7706294653" className="text-[#D4AF37] font-semibold hover:underline">
            Call dispatch: (770) 629-4653
          </a>
        </div>
      </div>
    </div>
  );
}
