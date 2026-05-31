import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Shield, Users, Heart, Phone, ChevronDown, ChevronUp,
  CheckCircle, ArrowRight, Star, Clock, MapPin, Ambulance,
  Accessibility, Activity, Calendar, Zap, Award, Mail, Send, MessageSquare
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const faqs = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 24–48 hours in advance to guarantee availability and ensure proper driver and vehicle assignment. For recurring or specialized transport (stretcher/gurney), 72 hours notice is preferred. Same-day and last-minute scheduling may be available — call us directly at (770) 629-4653."
  },
  {
    q: "Can a caregiver or family member ride along for free?",
    a: "Yes. One companion (caregiver, family member, or personal care attendant) may ride at no additional charge. Additional companions may be accommodated for a nominal fee. Please indicate companions when booking so we can ensure appropriate vehicle seating."
  },
  {
    q: "Do you provide the wheelchair?",
    a: "Yes. If you select 'Wheelchair Client (Van-Provided Chair Needed)' during booking, our driver will arrive at your door with a fully sanitized, agency-grade wheelchair. You do not need to own or bring your own chair. Our vans also feature heavy-duty ramps and 4-point tie-down locking systems for maximum safety."
  },
  {
    q: "What is your cancellation policy?",
    a: "We ask for at least 2 hours' notice for cancellations or rescheduling. Late cancellations or no-shows may be subject to a nominal fee. We understand medical situations change — please call us as early as possible so we can reallocate your driver to another client in need."
  },
  {
    q: "What areas do you serve?",
    a: "We primarily serve Clayton, Henry, and Fayette County, plus Metro Atlanta and surrounding Georgia counties. Please call us at (770) 629-4653 to confirm service availability for your specific pickup and drop-off locations."
  },
  {
    q: "Do you accept Medicaid or insurance?",
    a: "We work with various Medicaid MCO plans and insurance providers. Please call us directly at (770) 629-4653 to verify coverage for your specific plan and trip. Our staff will help you navigate the authorization process."
  }
];

const fleetTypes = [
  {
    id: "ambulatory",
    icon: <Users size={28} className="text-[#D4AF37]" />,
    title: "Ambulatory Transport",
    description: "For passengers who can walk and need light assistance. Our drivers provide door-through-door service — from your front door to your appointment entrance. Perfect for those who need steady guidance but remain mobile.",
    features: ["Door-through-door assistance", "Trained driver escort", "Comfortable seating", "Assistance with personal belongings"],
  },
  {
    id: "wheelchair",
    icon: <Accessibility size={28} className="text-[#D4AF37]" />,
    title: "Wheelchair Accessible Vans",
    description: "Fully equipped accessible vans with heavy-duty hydraulic ramps, certified 4-point tie-down locking systems, and spacious interiors. Drivers are trained in safe wheelchair loading and securement.",
    features: ["Heavy-duty hydraulic ramp", "4-point tie-down locking system", "Van-provided wheelchair available", "Certified securement training"],
  },
  {
    id: "stretcher",
    icon: <Activity size={28} className="text-[#D4AF37]" />,
    title: "Stretcher / Gurney Transport",
    description: "For bed-confined clients who require lying-down support throughout the journey. Our stretcher vans maintain patient comfort and dignity, accommodating those recovering from surgery or with acute mobility limitations.",
    features: ["Full-recline gurney transport", "Climate-controlled cabin", "Two-person crew available", "Medical facility coordination"],
  }
];

const destinations = [
  { icon: <Activity size={20} />, label: "Dialysis Appointments" },
  { icon: <Zap size={20} />, label: "Radiation & Oncology" },
  { icon: <Heart size={20} />, label: "Physical Therapy" },
  { icon: <Ambulance size={20} />, label: "Hospital Discharges" },
  { icon: <CheckCircle size={20} />, label: "Outpatient Surgeries" },
  { icon: <Users size={20} />, label: "Social & Family Gatherings" },
];

const steps = [
  { number: "01", title: "Easy Online Booking", desc: "Complete our guided booking form with your pickup/drop-off, date, time, and mobility needs. Confirmation is sent via phone or email." },
  { number: "02", title: "Dispatch Confirmation", desc: "Our team reviews your request and assigns a certified driver. A staff member contacts you to confirm final details, pricing, and driver info." },
  { number: "03", title: "Door-to-Door Pickup", desc: "Your driver arrives on time at your front door. They assist you from your home all the way to your appointment entrance." },
  { number: "04", title: "Safe Arrival", desc: "You arrive safely, comfortably, and on time. Round-trip clients are picked up after their appointment for the return journey home." },
];

export default function HomePage() {
  const [activeFleet, setActiveFleet] = useState("wheelchair");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "", phone: "", email: "", requestType: "", message: "", callback: false,
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const { setFormData, formData } = useBooking();
  const [quickPickup, setQuickPickup] = useState(formData.pickupAddress);
  const [quickDropoff, setQuickDropoff] = useState(formData.dropoffAddress);
  const [quickDate, setQuickDate] = useState(formData.date);
  const [, setLocation] = useLocation();

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ pickupAddress: quickPickup, dropoffAddress: quickDropoff, date: quickDate });
    setLocation("/book");
  };

  const activeFleetData = fleetTypes.find((f) => f.id === activeFleet)!;

  return (
    <div className="bg-white">
      {/* HERO */}
      <section id="hero" className="relative min-h-screen bg-[#0B0C10] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[#0B0C10]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-0 lg:min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

            {/* Left — text */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Your NEMT Provider</span>
              </div>
              <h1 className="sm:text-5xl lg:text-5xl xl:text-6xl font-serif font-bold text-white mb-6 text-[30px]"
                data-testid="hero-headline">
                GOOD FRIEND MEDICAL TRANSPORT AND LIMOUSINE
              </h1>

              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Safe, Reliable, and{" "}
                <span className="text-[#D4AF37] font-medium">Compassionate</span>{" "}
                Medical Transportation. Preserving your dignity and independence — every mile. We treat every passenger like a{" "}
                <span className="text-[#D4AF37] font-medium italic">Good Friend</span>, with certified drivers,
                specialized vehicles, and the compassionate care your family deserves.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/book">
                  <button
                    className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-8 py-4 rounded font-bold text-base tracking-wide hover:bg-[#f0cc60] transition-all duration-200 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)]"
                    data-testid="hero-book-btn"
                  >
                    Schedule a Ride Online
                    <ArrowRight size={18} />
                  </button>
                </Link>
                <a
                  href="tel:7706294653"
                  className="flex items-center justify-center gap-2 border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded font-bold text-base tracking-wide hover:bg-[#D4AF37]/10 transition-all duration-200"
                  data-testid="hero-phone-btn"
                >
                  <Phone size={18} />
                  Call Direct: (770) 629-4653
                </a>
              </div>

              <div className="flex flex-wrap gap-6 pt-6 border-t border-white/10">
                {[{ icon: <Shield size={15} />, label: "Background-Checked Drivers" }, { icon: <Award size={15} />, label: "CPR Certified" }, { icon: <Star size={15} />, label: "Sensitivity Trained" }].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-gray-400 text-sm">
                    <span className="text-[#D4AF37]">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — photo */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="absolute -inset-6 bg-[#D4AF37]/10 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/25 shadow-[0_0_60px_rgba(212,175,55,0.2)]">
                <img
                  src="/hero-van.png"
                  alt="Good Friend Transportation driver assisting a wheelchair passenger into an accessible van"
                  className="w-full h-[580px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-[#0B0C10]/80 backdrop-blur-sm border border-[#D4AF37]/30 rounded-xl px-5 py-4">
                    <p className="text-[#D4AF37] font-semibold text-sm">Wheelchair Accessible Transport</p>
                    <p className="text-gray-300 text-xs mt-0.5">Heavy-duty ramp · 4-point tie-down · Door-to-door assistance</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile hero image strip */}
        <div className="absolute inset-0 lg:hidden opacity-10 pointer-events-none">
          <img src="/hero-van.png" alt="" className="w-full h-full object-cover object-center" aria-hidden="true" />
        </div>

        <a href="#quick-book" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#D4AF37]/60 animate-bounce z-10">
          <ChevronDown size={28} />
        </a>
      </section>
      {/* QUICK BOOKING */}
      <section id="quick-book" className="bg-[#D4AF37] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-[#0B0C10] font-serif font-bold text-2xl">Start Booking Your Ride</h2>
            <p className="text-[#0B0C10]/70 text-sm mt-1">Quick 3-step entry — complete details on the next page</p>
          </div>
          <form onSubmit={handleQuickBook} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-[#0B0C10] text-xs font-semibold uppercase tracking-wide mb-1.5">
                Pickup Address
              </label>
              <input
                type="text"
                value={quickPickup}
                onChange={(e) => setQuickPickup(e.target.value)}
                placeholder="Your pickup address"
                className="w-full px-4 py-3 rounded bg-[#0B0C10] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                data-testid="quick-pickup"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-[#0B0C10] text-xs font-semibold uppercase tracking-wide mb-1.5">
                Drop-off Address
              </label>
              <input
                type="text"
                value={quickDropoff}
                onChange={(e) => setQuickDropoff(e.target.value)}
                placeholder="Destination address"
                className="w-full px-4 py-3 rounded bg-[#0B0C10] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                data-testid="quick-dropoff"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-[#0B0C10] text-xs font-semibold uppercase tracking-wide mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded bg-[#0B0C10] text-white text-sm focus:outline-none focus:ring-2 focus:ring-white"
                data-testid="quick-date"
              />
            </div>
            <div className="sm:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full bg-[#0B0C10] text-[#D4AF37] py-3 px-6 rounded font-bold text-sm tracking-wide hover:bg-[#1a1b22] transition-colors"
                data-testid="quick-book-submit"
              >
                Continue Booking
              </button>
            </div>
          </form>
        </div>
      </section>
      {/* VALUE PILLARS */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Why Choose Us</span>
                <div className="h-px w-12 bg-[#D4AF37]" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-[#0B0C10]">Our Core Commitment</h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={32} className="text-[#D4AF37]" />,
                title: "Safety & Reliability",
                desc: "Every trip is handled by background-checked, CPR-certified professionals in fully inspected, insured vehicles. We arrive on time, every time — because your health appointments can't wait.",
              },
              {
                icon: <Accessibility size={32} className="text-[#D4AF37]" />,
                title: "Specialized Mobility",
                desc: "From ambulatory passengers to wheelchair users to bed-confined clients requiring stretcher transport — our fleet and team are purpose-built for every mobility need.",
              },
              {
                icon: <Heart size={32} className="text-[#D4AF37]" />,
                title: "Compassionate Caregivers",
                desc: "Sensitivity-trained drivers who understand the emotional weight of medical travel. We don't just move people — we care for them like Good Friends, with patience and genuine kindness.",
              },
            ].map((pillar, i) => (
              <RevealSection key={pillar.title} delay={i * 150}>
                <div className="bg-white rounded-xl p-8 border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] group h-full"
                  data-testid={`pillar-card-${i}`}>
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#0B0C10] mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{pillar.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      {/* ABOUT US */}
      <section id="about" className="py-24 bg-[#0B0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealSection>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-12 bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">About Us</span>
                </div>
                <h2 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
                  More Than a Ride.<br />
                  <span className="text-[#D4AF37]">A Good Friend.</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-5">
                  Good Friend Transport Inc. was founded in Georgia with one mission: to ensure that every senior,
                  disabled individual, and medically vulnerable passenger receives transportation that honors their dignity.
                  We believe getting to your healthcare appointment should never be a source of anxiety.
                </p>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Our drivers aren't just trained professionals — they're compassionate people who genuinely care.
                  Before joining our team, every driver undergoes thorough background checks, drug screening,
                  CPR and First Aid certification, and specialized sensitivity training for passengers with
                  medical and mobility needs.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "FBI Background Checks",
                    "CPR & First Aid Certified",
                    "Sensitivity Training",
                    "Drug & Alcohol Screening",
                    "Defensive Driving Certified",
                    "HIPAA Awareness Training",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-[#D4AF37] flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 bg-[#D4AF37]/10 rounded-2xl blur-xl" />
                <div className="relative bg-[#111218] border border-[#D4AF37]/30 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    {[
                      { value: "100%", label: "Background Checked" },
                      { value: "24/7", label: "Scheduling Support" },
                      { value: "All Ages", label: "Passengers Served" },
                      { value: "Georgia", label: "State Licensed" },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 border border-[#D4AF37]/20 rounded-lg">
                        <div className="text-2xl font-serif font-bold text-[#D4AF37]">{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
      {/* FLEET */}
      <section id="fleet" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Our Fleet</span>
                <div className="h-px w-12 bg-[#D4AF37]" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-[#0B0C10]">Purpose-Built for Every Need</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Every vehicle in our fleet is inspected, insured, and equipped for the specific needs of medical transport.
              </p>
            </div>
          </RevealSection>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {fleetTypes.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFleet(f.id)}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                  activeFleet === f.id
                    ? "bg-[#D4AF37] text-[#0B0C10] shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "border-2 border-[#D4AF37]/30 text-gray-600 hover:border-[#D4AF37] hover:text-[#0B0C10]"
                }`}
                data-testid={`fleet-tab-${f.id}`}
              >
                {f.title}
              </button>
            ))}
          </div>

          <RevealSection>
            <div className="bg-[#0B0C10] rounded-2xl p-8 lg:p-12 border border-[#D4AF37]/20" data-testid="fleet-detail">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mb-6">
                    {activeFleetData.icon}
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-white mb-4">{activeFleetData.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-8">{activeFleetData.description}</p>
                  <Link href="/book">
                    <button className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-6 py-3 rounded font-bold text-sm hover:bg-[#f0cc60] transition-colors" data-testid="fleet-book-btn">
                      Book This Transport
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeFleetData.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-4">
                      <CheckCircle size={16} className="text-[#D4AF37] flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
      {/* WHO WE SERVE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Who We Serve</span>
                <div className="h-px w-12 bg-[#D4AF37]" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-[#0B0C10]">Common Destinations We Cover</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                From regular medical appointments to special occasions — wherever you need to go, we'll get you there safely.
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((dest, i) => (
              <RevealSection key={dest.label} delay={i * 80}>
                <div className="bg-white border-2 border-[#D4AF37]/15 rounded-xl p-6 text-center hover:border-[#D4AF37] hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)] transition-all duration-300 group h-full" data-testid={`destination-${i}`}>
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D4AF37]/20 transition-colors text-[#D4AF37]">
                    {dest.icon}
                  </div>
                  <p className="text-[#0B0C10] font-semibold text-sm leading-tight">{dest.label}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section className="py-24 bg-[#0B0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">The Process</span>
                <div className="h-px w-12 bg-[#D4AF37]" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-white">How It Works</h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <RevealSection key={step.number} delay={i * 150}>
                <div className="relative" data-testid={`step-${i}`}>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-[#D4AF37]/50 to-transparent z-0 -translate-y-0.5" />
                  )}
                  <div className="relative z-10 bg-[#111218] border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/50 transition-colors h-full">
                    <div className="text-[#D4AF37] font-serif text-4xl font-bold opacity-30 mb-4">{step.number}</div>
                    <h3 className="text-white font-semibold text-lg mb-3 font-serif">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">FAQs</span>
                <div className="h-px w-12 bg-[#D4AF37]" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-[#0B0C10]">Frequently Asked Questions</h2>
              <p className="text-gray-500 mt-3">Real answers to the questions families, seniors, and case managers ask most.</p>
            </div>
          </RevealSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <RevealSection key={i} delay={i * 60}>
                <div
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${openFaq === i ? "border-[#D4AF37]" : "border-[#D4AF37]/20 hover:border-[#D4AF37]/50"}`}
                  data-testid={`faq-item-${i}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                    aria-expanded={openFaq === i}
                    data-testid={`faq-toggle-${i}`}
                  >
                    <span className="font-semibold text-[#0B0C10] pr-4">{faq.q}</span>
                    <span className="flex-shrink-0 text-[#D4AF37]">
                      {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 border-t border-[#D4AF37]/20">
                      <p className="text-gray-600 leading-relaxed pt-4 text-sm">{faq.a}</p>
                    </div>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#0B0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Client Stories</span>
                <div className="h-px w-12 bg-[#D4AF37]" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-white">What Our Clients Say</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">Real families, real relief. Here's what it means to travel with a Good Friend.</p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "My mother has dialysis three times a week. After struggling with unreliable transport for months, we found Good Friend Transport and everything changed. The driver arrives early, helps her to the door, and always makes sure she's comfortable. It's given our whole family peace of mind.",
                name: "Patricia M.",
                relation: "Daughter of dialysis patient",
                location: "Marietta, GA",
                stars: 5,
              },
              {
                quote: "As a case manager, I coordinate transport for over 40 Medicaid clients. Good Friend is the only provider I trust without question. They communicate proactively, handle wheelchair clients with genuine care, and their drivers are always professional. I recommend them to every facility I work with.",
                name: "Darnell C.",
                relation: "Medicaid Case Manager",
                location: "Atlanta, GA",
                stars: 5,
              },
              {
                quote: "After my hip replacement, I needed transport to physical therapy twice a week for two months. Not once was the driver late. They helped me from my front door all the way to the therapy room. I felt like I was being looked after by a real friend, not just a driver.",
                name: "Margaret T.",
                relation: "Physical therapy patient",
                location: "Kennesaw, GA",
                stars: 5,
              },
              {
                quote: "My husband requires stretcher transport after his stroke. I was terrified about finding someone trustworthy. Good Friend Transport sent a two-person crew, handled everything with such gentleness, and kept me informed the whole time. I cannot recommend them enough.",
                name: "Gloria R.",
                relation: "Spouse of stroke patient",
                location: "Smyrna, GA",
                stars: 5,
              },
              {
                quote: "I've used other NEMT services before and the difference is night and day. Good Friend actually answers the phone, confirms the booking, and shows up. For someone who depends on these rides to get cancer treatment, reliability isn't a preference — it's everything.",
                name: "James W.",
                relation: "Oncology patient",
                location: "Decatur, GA",
                stars: 5,
              },
              {
                quote: "Booking online was simple enough that I did it myself at 78 years old. The driver called ahead, helped me with the door, and waited while I got my medication at the pharmacy. This is what compassionate service looks like.",
                name: "Dorothy H.",
                relation: "Senior passenger",
                location: "Duluth, GA",
                stars: 5,
              },
            ].map((t, i) => (
              <RevealSection key={i} delay={i * 80}>
                <div
                  className="bg-[#111218] border border-[#D4AF37]/15 rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all duration-300 h-full flex flex-col"
                  data-testid={`testimonial-${i}`}
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-[#D4AF37] text-xs mt-0.5">{t.relation}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{t.location}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      {/* SERVICE AREA PREVIEW */}
      <section id="service-area" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealSection>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-12 bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Coverage Zone</span>
                </div>
                <h2 className="text-4xl font-serif font-bold text-[#0B0C10] mb-5 leading-tight">
                  Proudly Serving<br />
                  <span className="text-[#D4AF37]">Clayton, Henry & Fayette</span> County — and Beyond
                </h2>
                <p className="text-gray-500 leading-relaxed mb-5">
                  Our primary focus is <strong className="text-[#0B0C10]">Clayton, Henry, and Fayette County</strong> — the communities we know best and serve most. We also cover Metro Atlanta and 15+ surrounding Georgia counties for patients who need us most.
                </p>

                {/* Primary focus counties */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {["Clayton","Henry","Fayette"].map((county) => (
                    <div key={county} className="flex items-center gap-1.5 bg-[#D4AF37] text-[#0B0C10] px-4 py-2 rounded-full text-sm font-bold">
                      <CheckCircle size={13} className="flex-shrink-0" />
                      {county} County
                    </div>
                  ))}
                  <div className="flex items-center px-3 py-2 text-xs text-[#D4AF37] font-semibold">— Primary Focus</div>
                </div>

                {/* Additional counties */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                  {[
                    "Fulton","DeKalb","Gwinnett","Cobb","Cherokee",
                    "Forsyth","Douglas","Rockdale","Newton",
                    "Paulding","Coweta","Spalding","Barrow","Hall","Carroll",
                  ].map((county) => (
                    <div key={county} className="flex items-center gap-1.5 text-sm text-gray-500">
                      <CheckCircle size={13} className="text-[#D4AF37]/60 flex-shrink-0" />
                      {county} County
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link href="/service-area">
                    <button className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors" data-testid="view-service-area-btn">
                      View Full Service Map
                      <ArrowRight size={15} />
                    </button>
                  </Link>
                  <a
                    href="tel:7706294653"
                    className="flex items-center gap-2 border-2 border-[#D4AF37]/40 text-[#D4AF37] px-6 py-3 rounded-lg font-semibold text-sm hover:border-[#D4AF37] transition-colors"
                  >
                    <Phone size={14} /> Not sure? Call us
                  </a>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={200}>
              <div className="relative flex items-center justify-center">
                {/* Simplified Georgia + Metro Atlanta map SVG */}
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-3xl blur-2xl" />
                  <div className="relative bg-gray-50 rounded-3xl border-2 border-[#D4AF37]/20 p-6 overflow-hidden">
                    <svg viewBox="0 0 340 400" className="w-full h-auto" aria-label="Georgia service area map">
                      {/* Georgia state outline (simplified) */}
                      <path
                        d="M 60 30 L 280 30 L 300 50 L 310 80 L 305 120 L 320 150 L 310 180 L 295 200 L 280 230 L 260 260 L 240 290 L 210 320 L 185 350 L 170 370 L 155 350 L 130 320 L 100 300 L 75 270 L 50 240 L 40 200 L 30 160 L 35 120 L 45 80 L 55 50 Z"
                        fill="#f8f9fa"
                        stroke="#D4AF37"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      {/* Metro Atlanta service zone highlight */}
                      <ellipse cx="172" cy="165" rx="80" ry="75" fill="#D4AF37" fillOpacity="0.15" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5 3" />
                      {/* Atlanta marker */}
                      <circle cx="172" cy="165" r="8" fill="#D4AF37" />
                      <circle cx="172" cy="165" r="14" fill="#D4AF37" fillOpacity="0.25" />
                      <circle cx="172" cy="165" r="22" fill="#D4AF37" fillOpacity="0.1" />
                      {/* Surrounding county dots */}
                      {[
                        [148, 135], [198, 135], [220, 155], [210, 185],
                        [185, 205], [155, 205], [130, 185], [125, 155],
                        [145, 115], [200, 115], [235, 140], [225, 210],
                        [175, 230], [135, 220], [110, 170], [120, 125],
                      ].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="4" fill="#D4AF37" fillOpacity="0.6" />
                      ))}
                      {/* Labels */}
                      <text x="172" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0B0C10" fontFamily="serif">ATLANTA</text>
                      <text x="172" y="207" textAnchor="middle" fontSize="8" fill="#D4AF37" fontWeight="600">Metro Service Area</text>
                      {/* Compass */}
                      <text x="295" y="60" textAnchor="middle" fontSize="9" fill="#D4AF37" fontWeight="700">N</text>
                      <line x1="295" y1="48" x2="295" y2="42" stroke="#D4AF37" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    </svg>
                    <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                        <span>Atlanta Hub</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]/50 border border-dashed border-[#D4AF37]" />
                        <span>Service Zone</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]/40" />
                        <span>Served Counties</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
      {/* CONTACT FORM */}
      <section id="contact-form" className="py-24 bg-[#0B0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Left — info column */}
            <div className="lg:col-span-2">
              <RevealSection>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-12 bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Get in Touch</span>
                </div>
                <h2 className="text-4xl font-serif font-bold text-white mb-4 leading-tight">
                  Not Ready to Book?<br />
                  <span className="text-[#D4AF37]">Send Us a Message.</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-10">
                  Have a question about coverage, pricing, or insurance? Need to talk through your situation first?
                  We're here — a real person will respond within a few hours.
                </p>

                <div className="space-y-5">
                  <a href="tel:7706294653" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors flex-shrink-0">
                      <Phone size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Call or Text</p>
                      <p className="text-white font-semibold group-hover:text-[#D4AF37] transition-colors">(770) 629-4653</p>
                    </div>
                  </a>

                  <a href="mailto:goodfriendtrans@gmail.com" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors flex-shrink-0">
                      <Mail size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Email Us</p>
                      <p className="text-white font-semibold group-hover:text-[#D4AF37] transition-colors">goodfriendtrans@gmail.com</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Response Time</p>
                      <p className="text-white font-semibold">Within a few hours, Mon–Sat</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Primary Service Area</p>
                      <p className="text-white font-semibold">Clayton, Henry & Fayette County</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-[#D4AF37]/8 border border-[#D4AF37]/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wide">Prefer to call?</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Call us at <a href="tel:7706294653" className="text-[#D4AF37] font-semibold hover:underline">(770) 629-4653</a> for same-day ride requests or urgent inquiries. Our team is available Monday–Saturday 6 AM – 8 PM.
                  </p>
                </div>
              </RevealSection>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <RevealSection delay={150}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.12)]">
                  {contactSubmitted ? (
                    /* Success state */
                    (<div className="flex flex-col items-center justify-center text-center px-8 py-16" data-testid="contact-success">
                      <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center mb-6">
                        <CheckCircle size={36} className="text-[#D4AF37]" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-[#0B0C10] mb-3">Message Sent!</h3>
                      <p className="text-gray-500 leading-relaxed max-w-sm mb-8">
                        Thank you, <strong>{contactForm.name.split(" ")[0]}</strong>. We've received your message and
                        {contactForm.callback ? " will call you back" : " will reply to you"} within a few hours.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setContactSubmitted(false); setContactForm({ name:"", phone:"", email:"", requestType:"", message:"", callback:false }); }}
                          className="border-2 border-[#D4AF37]/30 text-[#D4AF37] px-6 py-2.5 rounded-lg text-sm font-semibold hover:border-[#D4AF37] transition-colors"
                          data-testid="contact-send-another"
                        >
                          Send Another
                        </button>
                        <Link href="/book">
                          <button className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#f0cc60] transition-colors">
                            Book a Ride <ArrowRight size={14} />
                          </button>
                        </Link>
                      </div>
                    </div>)
                  ) : (
                    /* Form */
                    (<form
                      data-testid="contact-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setContactLoading(true);
                        try {
                          const base = import.meta.env.BASE_URL.replace(/\/$/, "");
                          await fetch(`${base}/api/leads`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...contactForm, source: "contact_form" }),
                          });
                        } catch {
                          // fallback: open mailto if API unreachable
                          const subject = encodeURIComponent(`[Good Friend Transport] ${contactForm.requestType || "General Inquiry"} — ${contactForm.name}`);
                          const body = encodeURIComponent(`Name: ${contactForm.name}\nPhone: ${contactForm.phone}\nEmail: ${contactForm.email}\nRequest Type: ${contactForm.requestType}\nCallback Requested: ${contactForm.callback ? "Yes" : "No"}\n\nMessage:\n${contactForm.message}`);
                          window.location.href = `mailto:goodfriendtrans@gmail.com?subject=${subject}&body=${body}`;
                        } finally {
                          setContactLoading(false);
                          setContactSubmitted(true);
                        }
                      }}
                      className="p-8 sm:p-10"
                    >
                      <div className="flex items-center gap-2 mb-8">
                        <div className="w-1 h-6 bg-[#D4AF37] rounded-full" />
                        <h3 className="text-lg font-bold text-[#0B0C10]">Send Us a Message</h3>
                        <span className="ml-auto text-xs text-gray-400">All fields required unless marked optional</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                            Your Name <span className="text-[#D4AF37]">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Patricia Moore"
                            value={contactForm.name}
                            onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B0C10] placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none transition-colors"
                            data-testid="contact-name"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                            Phone Number <span className="text-[#D4AF37]">*</span>
                          </label>
                          <input
                            required
                            type="tel"
                            placeholder="(770) 000-0000"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B0C10] placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none transition-colors"
                            data-testid="contact-phone"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                            Email Address <span className="text-gray-400 font-normal">(optional)</span>
                          </label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B0C10] placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none transition-colors"
                            data-testid="contact-email"
                          />
                        </div>

                        {/* Request type */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                            How Can We Help? <span className="text-[#D4AF37]">*</span>
                          </label>
                          <select
                            required
                            value={contactForm.requestType}
                            onChange={(e) => setContactForm((f) => ({ ...f, requestType: e.target.value }))}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B0C10] focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
                            data-testid="contact-request-type"
                          >
                            <option value="">Select a topic…</option>
                            <option value="Pricing & Rates">Pricing & Rates</option>
                            <option value="Service Area Check">Service Area Check</option>
                            <option value="Medicaid / Insurance">Medicaid / Insurance</option>
                            <option value="Wheelchair / Stretcher Transport">Wheelchair / Stretcher Transport</option>
                            <option value="Recurring Trips">Recurring Trips</option>
                            <option value="Same-Day Availability">Same-Day Availability</option>
                            <option value="General Question">General Question</option>
                          </select>
                        </div>
                      </div>
                      {/* Message */}
                      <div className="mb-5">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                          Message <span className="text-[#D4AF37]">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Tell us about your situation — pickup location, destination, mobility needs, or any other details that will help us assist you…"
                          value={contactForm.message}
                          onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B0C10] placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                          data-testid="contact-message"
                        />
                      </div>
                      {/* Callback checkbox */}
                      <label className="flex items-start gap-3 mb-7 cursor-pointer group" data-testid="contact-callback-label">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={contactForm.callback}
                            onChange={(e) => setContactForm((f) => ({ ...f, callback: e.target.checked }))}
                            data-testid="contact-callback"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${contactForm.callback ? "bg-[#D4AF37] border-[#D4AF37]" : "border-gray-300 group-hover:border-[#D4AF37]/50"}`}>
                            {contactForm.callback && <CheckCircle size={12} className="text-[#0B0C10]" />}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold text-[#0B0C10]">Request a callback</span> — I'd prefer someone call me rather than email me back.
                        </span>
                      </label>
                      <button
                        type="submit"
                        disabled={contactLoading}
                        className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B0C10] py-4 rounded-xl font-bold text-base tracking-wide hover:bg-[#f0cc60] transition-all duration-200 shadow-[0_4px_20px_rgba(212,175,55,0.35)] disabled:opacity-70 disabled:cursor-wait"
                        data-testid="contact-submit"
                      >
                        {contactLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#0B0C10]/30 border-t-[#0B0C10] rounded-full animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Message
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-400 text-center mt-4">
                        By submitting, your message will open in your email app pre-addressed to our team.
                      </p>
                    </form>)
                  )}
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>
      {/* INSURANCE & MEDICAID TEASER */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="rounded-3xl bg-[#0B0C10] overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: content */}
                <div className="p-10 sm:p-14">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-px w-10 bg-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Medicaid Benefit</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight mb-4">
                    Your Medicaid May Cover<br />
                    <span className="text-[#D4AF37]">This Ride — At No Cost.</span>
                  </h2>
                  <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
                    Most Georgia Medicaid plans include Non-Emergency Medical Transportation (NEMT) as a standard benefit.
                    If you qualify, we handle the authorization — you just show up.
                  </p>

                  <div className="space-y-4 mb-10">
                    {[
                      { icon: <Shield size={15} />, text: "Accepted by all major Georgia Medicaid MCO plans" },
                      { icon: <CheckCircle size={15} />, text: "Little or no out-of-pocket cost for eligible trips" },
                      { icon: <Users size={15} />, text: "We verify your coverage and handle prior authorization" },
                      { icon: <Heart size={15} />, text: "One free companion or caregiver seat included" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                          {item.icon}
                        </div>
                        {item.text}
                      </div>
                    ))}
                  </div>

                  <Link href="/insurance">
                    <button
                      className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#f0cc60] transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)]"
                      data-testid="insurance-read-more-btn"
                    >
                      Read the Full Insurance &amp; Medicaid Guide
                      <ArrowRight size={15} />
                    </button>
                  </Link>
                  <p className="text-gray-600 text-xs mt-4">
                    Not sure if you qualify? <a href="tel:7706294653" className="text-[#D4AF37] hover:underline">Call us at (770) 629-4653</a> and we'll verify in minutes.
                  </p>
                </div>

                {/* Right: accepted plans grid */}
                <div className="bg-white/5 border-l border-white/10 p-10 sm:p-14 flex flex-col justify-center">
                  <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-5">Georgia MCO Plans We Work With</p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "Amerigroup Georgia",
                      "CareSource Georgia",
                      "Molina Healthcare",
                      "Peach State Health Management",
                      "WellCare of Georgia",
                      "United Healthcare",
                      "Anthem Blue Cross",
                    ].map((plan) => (
                      <div key={plan} className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={11} className="text-[#D4AF37]" />
                        </div>
                        {plan}
                      </div>
                    ))}
                    <div className="flex items-center gap-3 text-sm text-gray-500 italic">
                      <div className="w-5 h-5 rounded-full border border-dashed border-gray-600 flex-shrink-0" />
                      + More — call to verify your plan
                    </div>
                  </div>
                  <div className="mt-8 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
                    <span className="text-[#D4AF37] font-semibold">Book at least 48 hours in advance</span> for Medicaid-covered trips so we can confirm authorization with your plan before your appointment.
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
      {/* FINAL CTA */}
      <section className="py-20 bg-[#0B0C10] border-t-4 border-[#D4AF37]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealSection>
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="h-px w-20 bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Ready to Ride?</span>
                  <div className="h-px w-20 bg-[#D4AF37]" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
                  Your Next Appointment<br />
                  <span className="text-[#D4AF37]">Starts with One Click.</span>
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                  Whether you need a one-time trip or recurring medical transport, we're here for you.
                  Book online or call us directly — a Good Friend is always ready.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/book">
                    <button
                      className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-10 py-4 rounded font-bold text-lg tracking-wide hover:bg-[#f0cc60] transition-all duration-200 shadow-[0_0_40px_rgba(212,175,55,0.5)]"
                      data-testid="final-book-btn"
                    >
                      Schedule a Ride Online
                      <ArrowRight size={20} />
                    </button>
                  </Link>
                  <a
                    href="tel:7706294653"
                    className="flex items-center justify-center gap-2 border-2 border-[#D4AF37] text-[#D4AF37] px-10 py-4 rounded font-bold text-lg hover:bg-[#D4AF37]/10 transition-colors"
                    data-testid="final-phone-btn"
                  >
                    <Phone size={20} />
                    (770) 629-4653
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-[#D4AF37]" /> Book 24–48 hrs in advance</div>
                  <div className="flex items-center gap-1.5"><MapPin size={14} className="text-[#D4AF37]" /> Serving Metro Atlanta & Georgia</div>
                  <div className="flex items-center gap-1.5"><Calendar size={14} className="text-[#D4AF37]" /> Same-day availability: call direct</div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
