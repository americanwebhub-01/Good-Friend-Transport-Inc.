import { useState } from "react";
import { CheckCircle, ChevronRight, Phone, ArrowLeft, ArrowRight, Copy, ChevronDown, ChevronUp, Info, Minus, Plus } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { Link } from "wouter";

function generateTrackingId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "GFT-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Route & Timing", "Mobility Profile", "Contact Info", "Review & Confirm"];
  return (
    <div className="w-full mb-10" aria-label="Booking steps">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {labels.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                  done ? "bg-[#D4AF37] text-[#0B0C10]" : active ? "bg-[#D4AF37] text-[#0B0C10] ring-4 ring-[#D4AF37]/30" : "bg-gray-200 text-gray-500"
                }`}>
                  {done ? <CheckCircle size={16} /> : step}
                </div>
                {i < total - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${done ? "bg-[#D4AF37]" : "bg-gray-200"}`} />
                )}
              </div>
              <span className={`text-xs mt-2 text-center hidden sm:block ${active ? "text-[#D4AF37] font-semibold" : done ? "text-gray-500" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step1({ onNext }: { onNext: () => void }) {
  const { formData, setFormData } = useBooking();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#0B0C10] mb-1">Route & Timing</h2>
        <p className="text-gray-500 text-sm">Enter your pickup and drop-off information.</p>
      </div>

      {/* Payment Type */}
      <div>
        <label className="block text-sm font-semibold text-[#0B0C10] mb-3">
          How will this ride be paid? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: "private-pay" as const,
              icon: "💳",
              title: "Private Pay",
              desc: "Pay out-of-pocket — see live fare estimate",
            },
            {
              id: "insurance" as const,
              icon: "🏥",
              title: "Insurance Covered",
              desc: "We verify your coverage & confirm before the ride",
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFormData({ paymentType: opt.id })}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                formData.paymentType === opt.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/5"
                  : "border-gray-200 hover:border-[#D4AF37]/50"
              }`}
              data-testid={`payment-type-${opt.id}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                  formData.paymentType === opt.id ? "bg-[#D4AF37]" : "bg-gray-100"
                }`}>
                  {opt.icon}
                </div>
                <div>
                  <div className="font-bold text-[#0B0C10] text-sm">{opt.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Insurance ID — only shown when insurance is selected */}
      {formData.paymentType === "insurance" && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Insurance Verification Required</p>
              <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                Our team will contact you after submission to verify your coverage and confirm the ride. <strong>No charge until coverage is confirmed.</strong>
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="insuranceId">
              Insurance Member ID <span className="text-red-500">*</span>
            </label>
            <input
              id="insuranceId"
              type="text"
              value={formData.insuranceId}
              onChange={(e) => setFormData({ insuranceId: e.target.value })}
              placeholder="e.g. BCBS1234567 — found on your insurance card"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
              data-testid="input-insurance-id"
            />
            <p className="text-xs text-gray-500 mt-1.5">Found on the front of your insurance card. We'll use this to check if NEMT rides are covered.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="pickupAddress">
            Full Pickup Address <span className="text-red-500">*</span>
          </label>
          <input
            id="pickupAddress"
            type="text"
            value={formData.pickupAddress}
            onChange={(e) => setFormData({ pickupAddress: e.target.value })}
            placeholder="123 Main Street, Atlanta, GA 30301"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
            data-testid="input-pickup-address"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="pickupUnit">
            Unit / Suite / Apt (optional)
          </label>
          <input
            id="pickupUnit"
            type="text"
            value={formData.pickupUnit}
            onChange={(e) => setFormData({ pickupUnit: e.target.value })}
            placeholder="Apt 2B"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
            data-testid="input-pickup-unit"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="facilityName">
            Facility / Clinic Name (optional)
          </label>
          <input
            id="facilityName"
            type="text"
            value={formData.facilityName}
            onChange={(e) => setFormData({ facilityName: e.target.value })}
            placeholder="Emory Dialysis Center"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
            data-testid="input-facility-name"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="dropoffAddress">
            Full Drop-off Address <span className="text-red-500">*</span>
          </label>
          <input
            id="dropoffAddress"
            type="text"
            value={formData.dropoffAddress}
            onChange={(e) => setFormData({ dropoffAddress: e.target.value })}
            placeholder="456 Peachtree Blvd, Atlanta, GA 30305"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
            data-testid="input-dropoff-address"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="date">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setFormData({ date: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
            data-testid="input-date"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="pickupTime">
            Pickup Time <span className="text-red-500">*</span>
          </label>
          <input
            id="pickupTime"
            type="time"
            value={formData.pickupTime}
            onChange={(e) => setFormData({ pickupTime: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
            data-testid="input-pickup-time"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0B0C10] mb-3">Trip Type <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "one-way", label: "One-Way", desc: "Single trip to destination" },
            { id: "round-trip", label: "Round-Trip", desc: "Pickup & return home after appointment" },
            { id: "recurring", label: "Recurring Weekly", desc: "Same trip, weekly schedule" },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({ tripType: type.id as "one-way" | "round-trip" | "recurring" })}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                formData.tripType === type.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/5"
                  : "border-gray-200 hover:border-[#D4AF37]/50"
              }`}
              data-testid={`trip-type-${type.id}`}
            >
              <div className="font-semibold text-[#0B0C10] text-sm">{type.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {formData.tripType === "round-trip" && (
        <div>
          <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="returnTime">
            Return Pickup Time <span className="text-red-500">*</span>
          </label>
          <input
            id="returnTime"
            type="time"
            value={formData.returnTime}
            onChange={(e) => setFormData({ returnTime: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors max-w-xs"
            data-testid="input-return-time"
          />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={
            !formData.paymentType ||
            (formData.paymentType === "insurance" && !formData.insuranceId) ||
            !formData.pickupAddress || !formData.dropoffAddress || !formData.date || !formData.pickupTime
          }
          className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="step1-next"
        >
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, setFormData } = useBooking();

  const assistanceOptions = [
    {
      id: "ambulatory",
      label: "Standard Ambulatory",
      desc: "Passenger can walk safely but needs assistance to/from the van door.",
    },
    {
      id: "wheelchair-own",
      label: "Wheelchair Client (Bringing Own Chair)",
      desc: "Passenger has their own wheelchair and will bring it for the trip.",
    },
    {
      id: "wheelchair-provided",
      label: "Wheelchair Client (Van-Provided Chair Needed)",
      desc: "Passenger needs a wheelchair — driver will bring one to your front door. No purchase necessary.",
    },
    {
      id: "stretcher",
      label: "Stretcher / Gurney Required",
      desc: "Passenger is bed-confined and needs full lying-down support throughout the journey.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#0B0C10] mb-1">Passenger Mobility Profile</h2>
        <p className="text-gray-500 text-sm">Help us assign the right vehicle and driver for your needs.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0B0C10] mb-3">
          Assistance Type Required <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {assistanceOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFormData({ assistanceType: opt.id as typeof formData.assistanceType })}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                formData.assistanceType === opt.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/5"
                  : "border-gray-200 hover:border-[#D4AF37]/50"
              }`}
              data-testid={`assistance-${opt.id}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                  formData.assistanceType === opt.id ? "border-[#D4AF37] bg-[#D4AF37]" : "border-gray-300"
                }`}>
                  {formData.assistanceType === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="font-semibold text-[#0B0C10] text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-[#0B0C10] mb-3">Oxygen Tank Accommodation</label>
          <div className="flex gap-3">
            {[{ val: true, label: "Yes, required" }, { val: false, label: "No" }].map((opt) => (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => setFormData({ oxygenTank: opt.val })}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                  formData.oxygenTank === opt.val
                    ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#0B0C10]"
                    : "border-gray-200 text-gray-500 hover:border-[#D4AF37]/50"
                }`}
                data-testid={`oxygen-${String(opt.val)}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0B0C10] mb-1.5" htmlFor="companions">
            Additional Companions
          </label>
          <select
            id="companions"
            value={formData.companions}
            onChange={(e) => setFormData({ companions: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
            data-testid="select-companions"
          >
            <option value="0">No additional companions</option>
            <option value="1">1 companion / caregiver</option>
            <option value="2">2 companions</option>
            <option value="3">3 companions</option>
            <option value="4">4 companions</option>
            <option value="5">5 companions</option>
          </select>
          <p className="text-xs text-gray-500 mt-1.5">First companion rides free. Additional may incur a nominal fee.</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#0B0C10] font-medium text-sm transition-colors" data-testid="step2-back">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors"
          data-testid="step2-next"
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, setFormData } = useBooking();

  const relationships = [
    { id: "self", label: "Self — I am the passenger" },
    { id: "child", label: "Child / Family Member" },
    { id: "case-manager", label: "Case Manager" },
    { id: "facility-coordinator", label: "Medical Facility Coordinator" },
  ];

  const isValid = formData.passengerName && formData.bookerName && formData.bookerPhone && formData.bookerEmail;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#0B0C10] mb-1">Responsible Party Information</h2>
        <p className="text-gray-500 text-sm">We need this information to confirm your booking and reach you before the trip.</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-[#0B0C10] text-sm mb-4 uppercase tracking-wide">Passenger Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0B0C10] mb-1.5" htmlFor="passengerName">
              Passenger Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="passengerName"
              type="text"
              value={formData.passengerName}
              onChange={(e) => setFormData({ passengerName: e.target.value })}
              placeholder="Jane Doe"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
              data-testid="input-passenger-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0B0C10] mb-1.5" htmlFor="passengerDob">
              Date of Birth
            </label>
            <input
              id="passengerDob"
              type="date"
              value={formData.passengerDob}
              onChange={(e) => setFormData({ passengerDob: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
              data-testid="input-passenger-dob"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-[#0B0C10] text-sm mb-4 uppercase tracking-wide">Booking Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#0B0C10] mb-1.5" htmlFor="bookerName">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="bookerName"
              type="text"
              value={formData.bookerName}
              onChange={(e) => setFormData({ bookerName: e.target.value })}
              placeholder="Your name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
              data-testid="input-booker-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0B0C10] mb-1.5" htmlFor="bookerPhone">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="bookerPhone"
              type="tel"
              value={formData.bookerPhone}
              onChange={(e) => setFormData({ bookerPhone: e.target.value })}
              placeholder="(770) 000-0000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
              data-testid="input-booker-phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0B0C10] mb-1.5" htmlFor="bookerEmail">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="bookerEmail"
              type="email"
              value={formData.bookerEmail}
              onChange={(e) => setFormData({ bookerEmail: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
              data-testid="input-booker-email"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#0B0C10] mb-3">Relationship to Passenger <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {relationships.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => setFormData({ relationship: rel.id as typeof formData.relationship })}
                  className={`py-2.5 px-3 rounded-lg border-2 text-xs font-semibold transition-all text-center ${
                    formData.relationship === rel.id
                      ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#0B0C10]"
                      : "border-gray-200 text-gray-500 hover:border-[#D4AF37]/50"
                  }`}
                  data-testid={`relationship-${rel.id}`}
                >
                  {rel.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#0B0C10] font-medium text-sm transition-colors" data-testid="step3-back">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="step3-next"
        >
          Review Booking <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Step4({ onBack, onSubmit, submitting, submitError }: { onBack: () => void; onSubmit: () => void; submitting?: boolean; submitError?: string }) {
  const { formData } = useBooking();

  const assistanceLabels: Record<string, string> = {
    ambulatory: "Standard Ambulatory",
    "wheelchair-own": "Wheelchair (Bringing Own)",
    "wheelchair-provided": "Wheelchair (Van-Provided)",
    stretcher: "Stretcher / Gurney",
  };

  const tripTypeLabels: Record<string, string> = {
    "one-way": "One-Way",
    "round-trip": "Round-Trip",
    recurring: "Recurring Weekly",
  };

  const relationshipLabels: Record<string, string> = {
    self: "Self (Passenger)",
    child: "Child / Family Member",
    "case-manager": "Case Manager",
    "facility-coordinator": "Medical Facility Coordinator",
  };

  const rows = [
    { label: "Pickup Address", value: [formData.pickupAddress, formData.pickupUnit].filter(Boolean).join(", ") },
    { label: "Drop-off Address", value: [formData.dropoffAddress, formData.facilityName].filter(Boolean).join(" — ") },
    { label: "Date", value: formData.date ? new Date(formData.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "—" },
    { label: "Pickup Time", value: formData.pickupTime || "—" },
    { label: "Trip Type", value: tripTypeLabels[formData.tripType] },
    ...(formData.tripType === "round-trip" ? [{ label: "Return Time", value: formData.returnTime || "—" }] : []),
    { label: "Assistance Type", value: assistanceLabels[formData.assistanceType] },
    { label: "Oxygen Tank", value: formData.oxygenTank ? "Yes — accommodation needed" : "No" },
    { label: "Companions", value: formData.companions === "0" ? "None" : `${formData.companions} companion(s)` },
    { label: "Passenger", value: formData.passengerName + (formData.passengerDob ? ` (DOB: ${formData.passengerDob})` : "") },
    { label: "Booking Contact", value: `${formData.bookerName} — ${formData.bookerPhone} — ${formData.bookerEmail}` },
    { label: "Relationship", value: relationshipLabels[formData.relationship] },
    { label: "Payment", value: formData.paymentType === "insurance" ? "Insurance Covered" : "Private Pay" },
    ...(formData.paymentType === "insurance" && formData.insuranceId
      ? [{ label: "Insurance ID", value: formData.insuranceId }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#0B0C10] mb-1">Review Your Booking</h2>
        <p className="text-gray-500 text-sm">Please review all details carefully before submitting.</p>
      </div>

      <div className="border-2 border-[#D4AF37]/30 rounded-xl overflow-hidden">
        <div className="bg-[#0B0C10] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-sm">Booking Summary</span>
          </div>
          <span className="text-[#D4AF37] text-xs font-mono uppercase tracking-wide">Pending Confirmation</span>
        </div>
        <div className="divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.label} className="flex px-6 py-3.5 gap-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-36 flex-shrink-0 pt-0.5">{row.label}</div>
              <div className="text-sm text-[#0B0C10] font-medium break-words flex-1">{row.value || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {formData.paymentType === "insurance" ? (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
          <h3 className="font-bold text-blue-900 text-sm mb-2">🏥 Insurance Verification Notice</h3>
          <p className="text-blue-800 text-xs leading-relaxed">
            After submitting, our team will verify insurance member ID <strong>{formData.insuranceId}</strong> to confirm
            your coverage. You will be contacted at <strong>{formData.bookerPhone}</strong> within 1–2 business days to
            confirm whether your insurance covers this ride. <strong>This booking is not confirmed until coverage is verified.</strong>
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-amber-900 text-sm mb-2">Important Notice</h3>
          <p className="text-amber-800 text-xs leading-relaxed">
            This booking request is <strong>pending final dispatch verification</strong>. A Good Friend Transport staff
            member will contact you via phone (<strong>(770) 629-4653</strong>) or email to confirm final pricing, vehicle
            assignment, and driver details before your trip. Your reservation is not finalized until confirmed by our team.
            Pricing varies based on distance, transport type, and companion count.
          </p>
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button onClick={onBack} disabled={submitting} className="flex items-center gap-2 text-gray-500 hover:text-[#0B0C10] font-medium text-sm transition-colors disabled:opacity-40" data-testid="step4-back">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
          data-testid="confirm-reservation-btn"
        >
          {submitting ? "Submitting…" : "Confirm Reservation"}
          {!submitting && <CheckCircle size={16} />}
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ trackingId }: { trackingId: string }) {
  const [copied, setCopied] = useState(false);
  const { resetFormData } = useBooking();

  const copyId = () => {
    navigator.clipboard.writeText(trackingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="text-center py-8" data-testid="success-screen">
      <div className="w-20 h-20 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-[#D4AF37]" />
      </div>

      <h2 className="text-3xl font-serif font-bold text-[#0B0C10] mb-2">Reservation Request Received!</h2>
      <p className="text-gray-500 mb-8 max-w-lg mx-auto">
        Thank you for choosing Good Friend Transport. Our team will contact you shortly to confirm your booking details, pricing, and driver assignment.
      </p>

      <div className="inline-flex flex-col items-center bg-[#0B0C10] rounded-2xl px-10 py-6 mb-8">
        <div className="text-[#D4AF37]/70 text-xs font-semibold tracking-widest uppercase mb-2">Your Tracking ID</div>
        <div className="text-[#D4AF37] font-mono text-3xl font-bold tracking-wider mb-3" data-testid="tracking-id">
          {trackingId}
        </div>
        <button
          onClick={copyId}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#D4AF37] transition-colors"
          data-testid="copy-tracking-id"
        >
          <Copy size={12} />
          {copied ? "Copied!" : "Copy ID"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
        <Link href={`/track?id=${trackingId}`} className="flex-1">
          <button
            className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            data-testid="track-ride-btn"
          >
            Track Your Ride
            <ArrowRight size={16} />
          </button>
        </Link>
        <a
          href="tel:7706294653"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold text-sm hover:border-[#D4AF37] hover:text-[#0B0C10] transition-colors"
          data-testid="success-call-btn"
        >
          <Phone size={16} />
          Call Dispatch
        </a>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 max-w-md mx-auto mb-6 text-sm text-gray-500">
        A confirmation will be sent to <span className="font-medium text-[#0B0C10]">your phone and email</span>.
        Share your tracking link with family so they can follow your trip in real time.
      </div>

      <Link href="/" onClick={() => resetFormData()}>
        <button className="text-sm text-gray-400 hover:text-[#0B0C10] underline transition-colors" data-testid="back-home-btn">
          Return to Home
        </button>
      </Link>
    </div>
  );
}

const PRICING = {
  ambulatory:            { base: 35, perMile: 2.50, label: "Ambulatory" },
  "wheelchair-own":      { base: 45, perMile: 3.00, label: "Wheelchair (Own)" },
  "wheelchair-provided": { base: 60, perMile: 3.50, label: "Wheelchair (Provided)" },
  stretcher:             { base: 90, perMile: 5.50, label: "Stretcher / Gurney" },
} as const;

const VARIANCE = 0.15; // ±15% range
const ROUND_TRIP_MULTIPLIER = 1.85;
const COMPANION_FEE = 10;

function calcEstimate(miles: number, assistanceType: string, companions: string, tripType: string) {
  const pricing = PRICING[assistanceType as keyof typeof PRICING] ?? PRICING.ambulatory;
  const companionCount = Math.max(0, parseInt(companions, 10) - 1); // first companion free
  const base = pricing.base + pricing.perMile * miles + companionCount * COMPANION_FEE;
  const multiplier = tripType === "round-trip" ? ROUND_TRIP_MULTIPLIER : 1;
  const total = base * multiplier;
  const low = Math.round(total * (1 - VARIANCE));
  const high = Math.round(total * (1 + VARIANCE));
  return { low, high, pricing, companionCount, multiplier };
}

function FareEstimator({ step }: { step: number }) {
  const { formData } = useBooking();
  const [miles, setMiles] = useState(10);
  const [expanded, setExpanded] = useState(true);

  const { low, high, pricing, companionCount, multiplier } = calcEstimate(
    miles, formData.assistanceType, formData.companions, formData.tripType
  );

  const tripLabel = { "one-way": "One-Way", "round-trip": "Round-Trip", recurring: "Recurring (per trip)" }[formData.tripType] ?? "One-Way";

  if (step === 5) return null;

  if (formData.paymentType === "insurance") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" data-testid="fare-estimator">
        <div className="bg-[#0B0C10] px-5 py-4">
          <p className="text-[#D4AF37] font-semibold text-sm">Insurance Covered</p>
          <p className="text-gray-500 text-xs mt-0.5">Fare pending verification</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-center py-5 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-3xl mb-2">🏥</div>
            <p className="text-sm font-bold text-blue-900">Pending Coverage Check</p>
            <p className="text-xs text-blue-700 mt-1.5 leading-relaxed px-2">
              Our team will verify your insurance and confirm the ride within 1–2 business days.
            </p>
          </div>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-start gap-2">
              <span className="text-[#D4AF37] font-bold mt-0.5">✓</span>
              <span>Submit your booking request below</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#D4AF37] font-bold mt-0.5">✓</span>
              <span>We verify your Member ID with your insurer</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#D4AF37] font-bold mt-0.5">✓</span>
              <span>We call you to confirm ride & any co-pay</span>
            </div>
          </div>
          <a
            href="tel:7706294653"
            className="flex items-center justify-center gap-1.5 w-full text-xs text-[#D4AF37] font-semibold hover:underline"
            data-testid="estimator-call"
          >
            <Phone size={12} /> Questions? Call (770) 629-4653
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" data-testid="fare-estimator">
      {/* Header */}
      <div className="bg-[#0B0C10] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#D4AF37] font-semibold text-sm">Fare Estimate</p>
          <p className="text-gray-500 text-xs mt-0.5">Live approximate range</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white transition-colors lg:hidden"
          aria-label="Toggle estimator"
          data-testid="estimator-toggle"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {(expanded) && (
        <div className="p-5 space-y-5">
          {/* Price display */}
          <div className="text-center py-4 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Estimated Range</p>
            <p className="text-3xl font-serif font-bold text-[#0B0C10]" data-testid="estimate-range">
              ${low} – ${high}
            </p>
            <p className="text-xs text-[#D4AF37] font-medium mt-1">{tripLabel}</p>
          </div>

          {/* Distance slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#0B0C10] uppercase tracking-wide">
                Est. Distance
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMiles(m => Math.max(1, m - 1))}
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors"
                  data-testid="miles-decrease"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-bold text-[#0B0C10] w-16 text-center" data-testid="miles-value">
                  {miles} mi
                </span>
                <button
                  onClick={() => setMiles(m => Math.min(150, m + 1))}
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors"
                  data-testid="miles-increase"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={150}
              value={miles}
              onChange={e => setMiles(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#D4AF37" }}
              data-testid="miles-slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1 mi</span>
              <span>150 mi</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Breakdown</p>
            <div className="flex justify-between text-gray-600">
              <span>Base rate ({pricing.label})</span>
              <span className="font-medium text-[#0B0C10]">${pricing.base}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Distance ({miles} mi × ${pricing.perMile.toFixed(2)})</span>
              <span className="font-medium text-[#0B0C10]">${(miles * pricing.perMile).toFixed(0)}</span>
            </div>
            {companionCount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>{companionCount} extra companion{companionCount > 1 ? "s" : ""}</span>
                <span className="font-medium text-[#0B0C10]">+${companionCount * COMPANION_FEE}</span>
              </div>
            )}
            {multiplier > 1 && (
              <div className="flex justify-between text-gray-600">
                <span>Round-trip (×{multiplier})</span>
                <span className="font-medium text-[#0B0C10]">included</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-[#0B0C10] border-t border-dashed border-gray-200 pt-2 mt-2">
              <span>Estimated total</span>
              <span className="text-[#D4AF37]">${low}–${high}</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <Info size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              This is an <strong>estimate only</strong>. Final pricing is confirmed by our team before your trip. Tolls, wait times & special equipment may affect the total.
            </p>
          </div>

          <a
            href="tel:7706294653"
            className="flex items-center justify-center gap-1.5 w-full text-xs text-[#D4AF37] font-semibold hover:underline"
            data-testid="estimator-call"
          >
            <Phone size={12} /> Questions? Call (770) 629-4653
          </a>
        </div>
      )}
    </div>
  );
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const ASSISTANCE_LABELS: Record<string, string> = {
  ambulatory: "Standard Ambulatory",
  "wheelchair-own": "Wheelchair (Bringing Own)",
  "wheelchair-provided": "Wheelchair (Van-Provided)",
  stretcher: "Stretcher / Gurney",
};

const TRIP_TYPE_LABELS: Record<string, string> = {
  "one-way": "One-Way",
  "round-trip": "Round-Trip",
  recurring: "Recurring Weekly",
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [trackingId, setTrackingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { formData } = useBooking();
  const TOTAL_STEPS = 4;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const message = [
        `Payment: ${formData.paymentType === "insurance" ? `Insurance Covered (Member ID: ${formData.insuranceId})` : "Private Pay"}`,
        `Trip: ${formData.pickupAddress}${formData.pickupUnit ? `, ${formData.pickupUnit}` : ""} → ${formData.dropoffAddress}${formData.facilityName ? ` (${formData.facilityName})` : ""}`,
        `Date: ${formData.date} at ${formData.pickupTime}${formData.tripType === "round-trip" ? `, return ${formData.returnTime}` : ""}`,
        `Type: ${TRIP_TYPE_LABELS[formData.tripType] ?? formData.tripType}`,
        `Transport: ${ASSISTANCE_LABELS[formData.assistanceType] ?? formData.assistanceType}`,
        `Oxygen: ${formData.oxygenTank ? "Yes" : "No"} | Companions: ${formData.companions}`,
        `Passenger: ${formData.passengerName}${formData.passengerDob ? ` (DOB: ${formData.passengerDob})` : ""}`,
        `Booker relationship: ${formData.relationship}`,
      ].join("\n");

      const res = await fetch(`${BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.bookerName,
          phone: formData.bookerPhone,
          email: formData.bookerEmail,
          requestType: formData.paymentType === "insurance" ? "Insurance Booking" : "Booking Request",
          message,
          callback: false,
          source: "booking_request",
          booking: {
            paymentType: formData.paymentType as "private-pay" | "insurance",
            ...(formData.paymentType === "insurance" && formData.insuranceId && { insuranceId: formData.insuranceId }),
            pickupAddress: formData.pickupAddress,
            ...(formData.pickupUnit && { pickupUnit: formData.pickupUnit }),
            dropoffAddress: formData.dropoffAddress,
            ...(formData.facilityName && { facilityName: formData.facilityName }),
            date: formData.date,
            pickupTime: formData.pickupTime,
            tripType: formData.tripType,
            ...(formData.returnTime && { returnTime: formData.returnTime }),
            assistanceType: formData.assistanceType,
            oxygenTank: formData.oxygenTank,
            companions: formData.companions,
            passengerName: formData.passengerName,
            ...(formData.passengerDob && { passengerDob: formData.passengerDob }),
            relationship: formData.relationship,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error ?? "Submission failed");
      }
      const data = await res.json() as { id: string };
      setTrackingId(data.id ?? generateTrackingId());
      setStep(5);
    } catch (e: unknown) {
      setSubmitError(
        e instanceof Error ? e.message : "Something went wrong. Please try again or call us at (770) 629-4653."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-[#0B0C10] py-12 border-b-4 border-[#D4AF37]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2" data-testid="booking-page-title">
            Book Your Ride
          </h1>
          <p className="text-gray-400 text-sm">
            Schedule your Non-Emergency Medical Transportation in minutes.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {step <= TOTAL_STEPS && <StepIndicator current={step} total={TOTAL_STEPS} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form — takes up 2/3 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {step === 1 && <Step1 onNext={() => setStep(2)} />}
              {step === 2 && <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} />}
              {step === 3 && <Step3 onNext={() => setStep(4)} onBack={() => setStep(2)} />}
              {step === 4 && <Step4 onBack={() => setStep(3)} onSubmit={handleSubmit} submitting={submitting} submitError={submitError} />}
              {step === 5 && <SuccessScreen trackingId={trackingId} />}
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              Questions? Call us at{" "}
              <a href="tel:7706294653" className="text-[#D4AF37] font-semibold hover:underline">(770) 629-4653</a>
            </div>
          </div>

          {/* Estimator — sticky sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <FareEstimator step={step} />
          </div>
        </div>
      </div>
    </div>
  );
}
