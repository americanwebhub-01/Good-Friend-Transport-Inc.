import { useState } from "react";
import { Link } from "wouter";
import {
  CheckCircle, Phone, ChevronDown, ChevronUp, ArrowRight,
  Shield, FileText, Clock, Users, Heart, AlertCircle, Mail
} from "lucide-react";

const MCO_PLANS = [
  { name: "Amerigroup Georgia",   color: "bg-blue-50 border-blue-200 text-blue-800" },
  { name: "CareSource Georgia",   color: "bg-green-50 border-green-200 text-green-800" },
  { name: "Molina Healthcare",    color: "bg-purple-50 border-purple-200 text-purple-800" },
  { name: "Peach State Health",   color: "bg-orange-50 border-orange-200 text-orange-800" },
  { name: "WellCare of Georgia",  color: "bg-teal-50 border-teal-200 text-teal-800" },
  { name: "United Healthcare",    color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
  { name: "Anthem Blue Cross",    color: "bg-red-50 border-red-200 text-red-800" },
];

const STEPS = [
  {
    number: "01",
    title: "Confirm NEMT Eligibility",
    desc: "Verify your Medicaid plan covers Non-Emergency Medical Transportation. Most Georgia Medicaid MCO plans include NEMT as a standard benefit. Call your plan's member services line or check your member handbook.",
    icon: <Shield size={20} />,
  },
  {
    number: "02",
    title: "Get a Physician's Referral (If Required)",
    desc: "Some plans require a written referral or prior authorization from your doctor confirming the medical necessity of the trip. Your doctor's office can help you obtain this before scheduling.",
    icon: <FileText size={20} />,
  },
  {
    number: "03",
    title: "Book Your Ride in Advance",
    desc: "Contact Good Friend Transport at least 24–48 hours before your appointment. Provide your Medicaid ID number, plan name, pickup and dropoff addresses, appointment time, and any mobility needs (wheelchair, stretcher, etc.).",
    icon: <Clock size={20} />,
  },
  {
    number: "04",
    title: "We Handle the Authorization",
    desc: "Our team coordinates directly with your Medicaid MCO plan to verify coverage and obtain any required pre-authorization. You don't need to navigate this yourself — we do it for you.",
    icon: <Users size={20} />,
  },
  {
    number: "05",
    title: "Ride at No Out-of-Pocket Cost",
    desc: "For covered Medicaid trips, there is typically no cost to you. We bill your plan directly. Any non-covered portions or trips outside your benefit will be communicated to you clearly before your ride.",
    icon: <Heart size={20} />,
  },
];

const DOCS = [
  "Your Medicaid ID card",
  "Photo ID (driver's license, state ID, or passport)",
  "Appointment confirmation or doctor's referral letter",
  "Insurance prior authorization number (if required by your plan)",
  "Emergency contact name and phone number",
  "List of current medications (for stretcher/wheelchair transport)",
];

const FAQS = [
  {
    q: "Does Medicaid cover transportation to all medical appointments?",
    a: "Medicaid NEMT generally covers transportation to appointments that are medically necessary — including doctor visits, dialysis, chemotherapy, physical therapy, mental health appointments, and specialist visits. Non-medical destinations (grocery stores, pharmacies alone, etc.) are typically not covered.",
  },
  {
    q: "What if my Medicaid plan is not listed above?",
    a: "Call us at (770) 629-4653 and we'll verify your specific plan. Coverage changes frequently, and we work to stay current with all active Georgia Medicaid MCO plans. We may still be able to serve you.",
  },
  {
    q: "Can a family member or caregiver ride with me?",
    a: "Yes. One companion (caregiver, personal care attendant, or family member) may ride at no additional charge under most Medicaid plans. Additional companions may require approval or a small co-pay depending on your plan.",
  },
  {
    q: "What if I need transportation but don't have Medicaid?",
    a: "We also offer private-pay transportation at competitive rates. Call us to discuss pricing for your specific trip. We'll always provide a clear quote before you commit.",
  },
  {
    q: "How far in advance do I need to book a Medicaid-covered ride?",
    a: "We recommend at least 48–72 hours for Medicaid-covered trips to allow time for authorization. Urgent or same-day trips may be possible in some cases — call us directly at (770) 629-4653.",
  },
  {
    q: "What if my appointment is canceled or rescheduled?",
    a: "Please notify us as soon as possible — at least 2 hours before your scheduled pickup. This lets us reallocate the driver and avoid a no-show fee. Call (770) 629-4653 to cancel or reschedule.",
  },
  {
    q: "Do you handle wheelchair and stretcher transport under Medicaid?",
    a: "Yes. We provide wheelchair-accessible vans and stretcher/gurney transport. These are billable under NEMT for eligible Medicaid beneficiaries. Please inform us of your mobility needs when booking so we can assign the correct vehicle and crew.",
  },
];

export default function InsurancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <div className="bg-[#0B0C10] py-16 border-b-4 border-[#D4AF37]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-12 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Benefits Guide</span>
            <div className="h-px w-12 bg-[#D4AF37]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4" data-testid="insurance-title">
            Insurance &amp; Medicaid Guide
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Many Georgia residents qualify for free Non-Emergency Medical Transportation through Medicaid.
            Here's everything you need to know to use your benefit — no paperwork maze required.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a href="tel:7706294653" className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors">
              <Phone size={15} /> Call to Verify Your Plan
            </a>
            <Link href="/book">
              <button className="flex items-center gap-2 border-2 border-[#D4AF37]/40 text-[#D4AF37] px-6 py-3 rounded-lg font-semibold text-sm hover:border-[#D4AF37] transition-colors">
                Book a Ride <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* What is NEMT */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">What Is NEMT?</span>
              <h2 className="text-3xl font-serif font-bold text-[#0B0C10] mt-2 mb-4">
                Non-Emergency Medical Transportation
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                NEMT is a Medicaid benefit that pays for transportation to and from medical appointments for eligible members
                who cannot drive themselves or access public transit due to age, disability, or medical condition.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                It covers trips to doctor visits, dialysis, chemotherapy, physical therapy, mental health appointments,
                specialist visits, and more — at little or no cost to you.
              </p>
              <div className="space-y-3">
                {[
                  "Available to most Georgia Medicaid enrollees",
                  "Covers wheelchair, ambulatory, and stretcher transport",
                  "No out-of-pocket cost for covered trips",
                  "Includes a free companion/caregiver seat",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle size={15} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0B0C10] rounded-2xl p-8 border border-[#D4AF37]/20">
              <div className="flex items-center gap-2 mb-5">
                <AlertCircle size={16} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm font-semibold">Who Qualifies?</span>
              </div>
              <div className="space-y-4 text-sm text-gray-400">
                {[
                  { title: "Medicaid Enrollees", desc: "You must be enrolled in a Georgia Medicaid plan (Medicaid, PeachCare, or a Medicaid MCO)." },
                  { title: "Medical Necessity", desc: "The trip must be to a covered medical appointment. Your doctor may need to certify the need." },
                  { title: "No Other Transport Available", desc: "You must not have access to a personal vehicle or family member who can drive you." },
                  { title: "Advance Booking", desc: "Most plans require 48–72 hours advance notice. Same-day trips may be possible with prior authorization." },
                ].map((item) => (
                  <div key={item.title}>
                    <p className="text-white font-semibold mb-0.5">{item.title}</p>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accepted MCO Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Accepted Plans</span>
            <h2 className="text-3xl font-serif font-bold text-[#0B0C10] mt-2">Georgia Medicaid MCO Plans We Work With</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">We coordinate with all major Georgia Medicaid Managed Care Organizations. Not sure about your plan? Call us.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6" data-testid="mco-plans">
            {MCO_PLANS.map((plan) => (
              <div key={plan.name} className={`border-2 rounded-xl px-4 py-3 text-center text-sm font-semibold ${plan.color}`}>
                <CheckCircle size={14} className="inline mr-1.5 opacity-70" />
                {plan.name}
              </div>
            ))}
            <div className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-center text-sm text-gray-400">
              + More — call to verify
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-center">
            <strong>Coverage changes regularly.</strong> Always call your plan's member services and confirm with us before your appointment. We're happy to verify on your behalf.
          </div>
        </div>
      </section>

      {/* Step-by-step guide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">How It Works</span>
            <h2 className="text-3xl font-serif font-bold text-[#0B0C10] mt-2">Using Your Medicaid NEMT Benefit</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">Step-by-step from eligibility to your front door — we handle the hard parts.</p>
          </div>
          <div className="space-y-5" data-testid="steps-list">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#D4AF37] text-xs font-bold tracking-widest">STEP {step.number}</span>
                  </div>
                  <h3 className="font-bold text-[#0B0C10] mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to bring */}
      <section className="py-16 bg-[#0B0C10]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Documentation</span>
              <h2 className="text-3xl font-serif font-bold text-white mt-2 mb-4">What to Have Ready</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Having your documents ready helps us verify coverage quickly and ensures a smooth, on-time pickup. Keep this checklist handy when you call to book.
              </p>
              <div className="space-y-3">
                {DOCS.map((doc) => (
                  <div key={doc} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={11} className="text-[#D4AF37]" />
                    </div>
                    {doc}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-[#D4AF37]/20 rounded-2xl p-7">
              <h3 className="text-white font-bold text-lg mb-5 font-serif">Private-Pay Rates</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Don't have Medicaid? We offer transparent private-pay rates so you always know the cost upfront.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { type: "Ambulatory (walking)", rate: "Starting from $35" },
                  { type: "Wheelchair Transport", rate: "Starting from $55" },
                  { type: "Stretcher / Gurney", rate: "Starting from $95" },
                  { type: "Long Distance (50+ mi)", rate: "Custom quote" },
                ].map((row) => (
                  <div key={row.type} className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-300">{row.type}</span>
                    <span className="text-[#D4AF37] font-semibold">{row.rate}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-4">Rates vary by distance, time, and companions. A confirmed quote is provided before every trip.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">FAQs</span>
            <h2 className="text-3xl font-serif font-bold text-[#0B0C10] mt-2">Common Questions</h2>
          </div>
          <div className="space-y-3" data-testid="insurance-faq">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-2 border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-[#0B0C10] pr-4 text-sm">{faq.q}</span>
                  <span className="flex-shrink-0 text-[#D4AF37]">
                    {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <p className="text-gray-600 text-sm leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0B0C10] border-t-4 border-[#D4AF37]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-3">Ready to Use Your Benefit?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Call us and we'll verify your Medicaid coverage in minutes. If you qualify, your first ride could be at no cost to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:7706294653" className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-8 py-3.5 rounded-lg font-bold hover:bg-[#f0cc60] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <Phone size={16} /> Call (770) 629-4653
            </a>
            <a href="mailto:goodfriendtrans@gmail.com" className="flex items-center justify-center gap-2 border-2 border-[#D4AF37]/40 text-[#D4AF37] px-8 py-3.5 rounded-lg font-semibold hover:border-[#D4AF37] transition-colors">
              <Mail size={15} /> goodfriendtrans@gmail.com
            </a>
          </div>
          <div className="mt-6">
            <Link href="/book">
              <button className="text-gray-500 text-sm hover:text-[#D4AF37] transition-colors underline underline-offset-4">
                Or go straight to booking →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
