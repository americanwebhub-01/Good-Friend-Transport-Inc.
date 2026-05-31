import { useState } from "react";
import { CheckCircle, Phone, Search, MapPin, ArrowRight, X } from "lucide-react";
import { Link } from "wouter";

const COUNTIES = [
  { name: "Fulton",    cities: ["Atlanta", "Sandy Springs", "Alpharetta", "Roswell", "College Park"] },
  { name: "DeKalb",   cities: ["Decatur", "Tucker", "Stone Mountain", "Lithonia", "Chamblee"] },
  { name: "Gwinnett", cities: ["Lawrenceville", "Duluth", "Suwanee", "Norcross", "Buford"] },
  { name: "Cobb",     cities: ["Marietta", "Kennesaw", "Smyrna", "Acworth", "Powder Springs"] },
  { name: "Clayton",  cities: ["Jonesboro", "Morrow", "Forest Park", "Riverdale", "Lake City"] },
  { name: "Cherokee", cities: ["Canton", "Ball Ground", "Holly Springs", "Woodstock"] },
  { name: "Forsyth",  cities: ["Cumming", "Suwanee", "Johns Creek"] },
  { name: "Henry",    cities: ["McDonough", "Stockbridge", "Hampton", "Locust Grove"] },
  { name: "Douglas",  cities: ["Douglasville", "Villa Rica", "Lithia Springs"] },
  { name: "Rockdale", cities: ["Conyers", "Milstead"] },
  { name: "Fayette",  cities: ["Fayetteville", "Peachtree City", "Tyrone", "Brooks"] },
  { name: "Newton",   cities: ["Covington", "Oxford", "Porterdale"] },
  { name: "Paulding", cities: ["Dallas", "Hiram", "Braswell"] },
  { name: "Coweta",   cities: ["Newnan", "Senoia", "Sharpsburg", "Turin"] },
  { name: "Spalding", cities: ["Griffin", "Orchard Hill", "Sunny Side"] },
  { name: "Barrow",   cities: ["Winder", "Auburn", "Statham"] },
  { name: "Hall",     cities: ["Gainesville", "Flowery Branch", "Oakwood", "Braselton"] },
  { name: "Carroll",  cities: ["Carrollton", "Villa Rica", "Temple", "Bowdon"] },
];

// Approximate (x,y) positions in the SVG for each county label
const COUNTY_POSITIONS: Record<string, [number, number]> = {
  Fulton:   [170, 162],
  DeKalb:   [208, 162],
  Gwinnett: [228, 138],
  Cobb:     [148, 148],
  Clayton:  [192, 192],
  Cherokee: [155, 110],
  Forsyth:  [195, 108],
  Henry:    [200, 215],
  Douglas:  [130, 175],
  Rockdale: [228, 185],
  Fayette:  [160, 210],
  Newton:   [248, 190],
  Paulding: [118, 152],
  Coweta:   [138, 218],
  Spalding: [178, 235],
  Barrow:   [248, 130],
  Hall:     [230, 100],
  Carroll:  [112, 205],
};

export default function ServiceAreaPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = COUNTIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cities.some((city) => city.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedCounty = COUNTIES.find((c) => c.name === selected);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-[#0B0C10] py-14 border-b-4 border-[#D4AF37]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-12 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Where We Operate</span>
            <div className="h-px w-12 bg-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-white mb-3" data-testid="service-area-title">
            Service Area
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Good Friend Transport serves Metro Atlanta and 18 surrounding Georgia counties.
            Click any county to see the cities we cover, or search below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Map Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border-2 border-[#D4AF37]/20 overflow-hidden shadow-sm">
              <div className="bg-[#0B0C10] px-5 py-3 flex items-center gap-2">
                <MapPin size={14} className="text-[#D4AF37]" />
                <span className="text-white text-sm font-semibold">Metro Atlanta Service Zone</span>
              </div>
              <div className="p-4">
                <svg
                  viewBox="0 60 340 300"
                  className="w-full h-auto"
                  aria-label="Interactive Georgia service area map"
                  data-testid="service-map-svg"
                >
                  {/* Georgia simplified outline */}
                  <path
                    d="M 60 30 L 280 30 L 300 50 L 310 80 L 305 120 L 320 150 L 310 180 L 295 200 L 280 230 L 260 260 L 240 290 L 210 320 L 185 350 L 170 370 L 155 350 L 130 320 L 100 300 L 75 270 L 50 240 L 40 200 L 30 160 L 35 120 L 45 80 L 55 50 Z"
                    fill="#f1f3f5"
                    stroke="#dee2e6"
                    strokeWidth="1.5"
                  />

                  {/* Service zone glow */}
                  <ellipse cx="183" cy="168" rx="105" ry="95" fill="#D4AF37" fillOpacity="0.08" />

                  {/* County circles — clickable */}
                  {COUNTIES.map((county) => {
                    const [cx, cy] = COUNTY_POSITIONS[county.name] ?? [170, 165];
                    const isSelected = selected === county.name;
                    const isFiltered = search && !filtered.find((c) => c.name === county.name);
                    return (
                      <g
                        key={county.name}
                        onClick={() => setSelected(isSelected ? null : county.name)}
                        className="cursor-pointer"
                        role="button"
                        aria-label={`${county.name} County`}
                        data-testid={`county-dot-${county.name}`}
                      >
                        <circle
                          cx={cx} cy={cy} r={isSelected ? 13 : 9}
                          fill={isSelected ? "#D4AF37" : isFiltered ? "#dee2e6" : "#D4AF37"}
                          fillOpacity={isFiltered ? 0.3 : isSelected ? 1 : 0.7}
                          stroke={isSelected ? "#0B0C10" : "#D4AF37"}
                          strokeWidth={isSelected ? 2 : 1}
                          style={{ transition: "all 0.2s" }}
                        />
                        {isSelected && (
                          <circle cx={cx} cy={cy} r="20" fill="#D4AF37" fillOpacity="0.15" />
                        )}
                        <text
                          x={cx} y={cy + (isSelected ? 28 : 22)}
                          textAnchor="middle"
                          fontSize={isSelected ? "8.5" : "7"}
                          fontWeight={isSelected ? "700" : "600"}
                          fill={isSelected ? "#0B0C10" : "#6b7280"}
                          fontFamily="Inter, sans-serif"
                        >
                          {county.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Atlanta core star */}
                  <circle cx="170" cy="162" r="5" fill="#0B0C10" />
                  <circle cx="170" cy="162" r="10" fill="#0B0C10" fillOpacity="0.15" />

                  {/* Legend */}
                  <rect x="60" y="320" width="130" height="40" rx="6" fill="white" fillOpacity="0.9" />
                  <circle cx="76" cy="332" r="5" fill="#D4AF37" />
                  <text x="85" y="336" fontSize="7.5" fill="#374151" fontFamily="Inter, sans-serif">Served County</text>
                  <circle cx="76" cy="350" r="5" fill="#0B0C10" />
                  <text x="85" y="354" fontSize="7.5" fill="#374151" fontFamily="Inter, sans-serif">Atlanta (hub)</text>
                </svg>

                <p className="text-xs text-gray-400 text-center mt-2">
                  Click a county dot to see covered cities
                </p>
              </div>
            </div>
          </div>

          {/* County list + search column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search county or city…"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
                data-testid="county-search"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selected county details */}
            {selectedCounty && (
              <div className="bg-[#0B0C10] rounded-xl p-5 border border-[#D4AF37]/30" data-testid="selected-county-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">Selected County</p>
                    <h3 className="text-white font-serif font-bold text-xl">{selectedCounty.name} County</h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-gray-400 text-xs mb-3">Cities & communities we serve:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCounty.cities.map((city) => (
                    <span key={city} className="px-2.5 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs font-medium">
                      {city}
                    </span>
                  ))}
                </div>
                <Link href="/book" className="mt-4 block">
                  <button className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B0C10] py-2.5 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors mt-4" data-testid="book-from-county-btn">
                    Book a Ride from {selectedCounty.name} County
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            )}

            {/* County list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {filtered.length} of {COUNTIES.length} Counties
                </span>
                <CheckCircle size={13} className="text-[#D4AF37]" />
              </div>
              <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
                {filtered.map((county) => (
                  <button
                    key={county.name}
                    onClick={() => setSelected(selected === county.name ? null : county.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#D4AF37]/5 transition-colors group ${selected === county.name ? "bg-[#D4AF37]/10" : ""}`}
                    data-testid={`county-list-${county.name}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${selected === county.name ? "bg-[#D4AF37]" : "bg-[#D4AF37]/50"}`} />
                      <span className={`text-sm font-semibold ${selected === county.name ? "text-[#0B0C10]" : "text-gray-700"}`}>
                        {county.name} County
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                      {county.cities.length} cities
                    </span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-gray-400" data-testid="no-county-results">
                    No counties match "{search}".
                    <br />
                    <a href="tel:7706294653" className="text-[#D4AF37] font-semibold mt-1 inline-block hover:underline">
                      Call us to check your area
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Not in list CTA */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
              <p className="text-amber-800 font-semibold mb-1">Don't see your county?</p>
              <p className="text-amber-700 text-xs leading-relaxed">
                Our coverage is expanding. Call us at <a href="tel:7706294653" className="font-bold underline">(770) 629-4653</a> and we'll let you know if we can accommodate your trip.
              </p>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "18+", label: "Counties Served" },
            { value: "200+", label: "Cities & Communities" },
            { value: "Metro ATL", label: "Primary Hub" },
            { value: "Georgia", label: "State Licensed" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm">
              <p className="text-2xl font-serif font-bold text-[#D4AF37]">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 bg-[#0B0C10] rounded-2xl p-8 text-center border border-[#D4AF37]/20">
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Ready to Schedule Your Ride?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            If your county is listed above, you're in our coverage zone. Book online or call — we'll take care of the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book">
              <button className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B0C10] px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#f0cc60] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]" data-testid="service-area-book-btn">
                Book a Ride Now <ArrowRight size={15} />
              </button>
            </Link>
            <a href="tel:7706294653" className="flex items-center justify-center gap-2 border-2 border-[#D4AF37]/40 text-[#D4AF37] px-8 py-3 rounded-lg font-semibold text-sm hover:border-[#D4AF37] transition-colors">
              <Phone size={14} /> (770) 629-4653
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
