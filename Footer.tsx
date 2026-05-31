import { Phone, Mail, MapPin, Clock, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#0B0C10] text-white border-t border-[#D4AF37]/30" id="contact" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="text-white font-extrabold text-base leading-tight tracking-widest uppercase">Good Friend</div>
              <div className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">Transport Inc.</div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Good Friend Transport Inc. is Georgia's premier Non-Emergency Medical
              Transportation provider. We treat every passenger like a Good Friend —
              with dignity, compassion, and professionalism.
            </p>
          </div>

          <div>
            <h3 className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:7706294653"
                  className="flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] transition-colors group"
                  data-testid="footer-phone"
                >
                  <Phone size={14} className="text-[#D4AF37]" />
                  <span>(770) 629-4653 <span className="text-[#D4AF37] text-xs font-semibold">(Main)</span></span>
                </a>
              </li>
              <li>
                <a
                  href="tel:7709099393"
                  className="flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] transition-colors group"
                  data-testid="footer-phone-2"
                >
                  <Phone size={14} className="text-[#D4AF37]" />
                  <span>770-909-9393 <span className="text-gray-500 text-xs">(Alt)</span></span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:goodfriendtrans@gmail.com"
                  className="flex items-start gap-2 text-gray-300 hover:text-[#D4AF37] transition-colors break-all"
                  data-testid="footer-email"
                >
                  <Mail size={14} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <span>goodfriendtrans@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={14} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <span>Serving Metro Atlanta & Surrounding Georgia Counties</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase mb-4">Service Hours</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Clock size={13} className="text-[#D4AF37]" />
                <span>Monday – Friday: 6:00 AM – 8:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={13} className="text-[#D4AF37]" />
                <span>Saturday: 7:00 AM – 6:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={13} className="text-[#D4AF37]" />
                <span>Sunday: By appointment only</span>
              </li>
              <li className="mt-4 text-[#D4AF37] font-medium">
                Last-minute bookings: Call directly
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "About Us", "Our Fleet", "Services", "FAQs"].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/service-area" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Service Area
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Insurance &amp; Medicaid
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Track Your Ride
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-[#D4AF37] font-semibold hover:text-[#f0cc60] transition-colors">
                  Book a Ride
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-start gap-2 bg-white/5 rounded-lg p-4 mb-6">
            <Shield size={16} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="text-gray-400 font-medium">Legal Disclaimer:</span> Good Friend Transport Inc. is a Non-Emergency Medical Transportation (NEMT)
              provider. We do not provide emergency medical services. In case of a medical emergency, please call 911.
              All bookings are subject to availability and final dispatch verification. Pricing is confirmed prior to each trip.
              Good Friend Transport Inc. is fully licensed and insured in the State of Georgia.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Good Friend Transport Inc. All rights reserved.</p>
            <p>Licensed NEMT Provider — State of Georgia</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
