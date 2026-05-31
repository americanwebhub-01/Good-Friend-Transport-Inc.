import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/", anchor: "#hero" },
  { label: "About Us", href: "/", anchor: "#about" },
  { label: "Our Fleet", href: "/", anchor: "#fleet" },
  { label: "Services", href: "/", anchor: "#services" },
  { label: "FAQs", href: "/", anchor: "#faq" },
  { label: "Contact Us", href: "/", anchor: "#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (anchor: string) => {
    setMobileOpen(false);
    if (location === "/") {
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B0C10]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(212,175,55,0.15)]"
          : "bg-[#0B0C10]"
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" data-testid="logo-link">
            <div>
              <div className="text-white font-extrabold text-lg leading-tight tracking-widest uppercase">
                Good Friend
              </div>
              <div className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">
                Transport Inc.
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.anchor)}
                className="text-gray-300 hover:text-[#D4AF37] text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer"
                data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/track">
              <button
                className="hidden md:block border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1.5 rounded text-xs font-semibold tracking-wide hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
                data-testid="header-track-btn"
              >
                Track Ride
              </button>
            </Link>
            <a
              href="tel:7706294653"
              className="hidden md:flex items-center gap-1.5 text-[#D4AF37] text-sm font-semibold hover:text-[#f0cc60] transition-colors"
              data-testid="header-phone"
            >
              <Phone size={14} />
              (770) 629-4653
            </a>
            <Link href="/book">
              <button
                className="hidden md:block bg-[#D4AF37] text-[#0B0C10] px-5 py-2.5 rounded font-bold text-sm tracking-wide hover:bg-[#f0cc60] transition-all duration-200 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
                data-testid="header-book-btn"
              >
                Book a Ride
              </button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-2"
              aria-label="Toggle menu"
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0B0C10] border-t border-[#D4AF37]/20" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.anchor)}
                className="block w-full text-left text-gray-300 hover:text-[#D4AF37] py-3 px-2 text-base font-medium border-b border-white/5 transition-colors"
                data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 space-y-3">
              <a
                href="tel:7706294653"
                className="flex items-center gap-2 text-[#D4AF37] font-semibold py-2"
                data-testid="mobile-phone"
              >
                <Phone size={16} />
                (770) 629-4653
              </a>
              <Link href="/book" onClick={() => setMobileOpen(false)}>
                <button
                  className="w-full bg-[#D4AF37] text-[#0B0C10] py-3 rounded font-bold text-base tracking-wide"
                  data-testid="mobile-book-btn"
                >
                  Book a Ride
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
