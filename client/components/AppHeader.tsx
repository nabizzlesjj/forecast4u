import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Cloud, Menu, X, Search, LifeBuoy } from "lucide-react";

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const navigate = useNavigate();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const zip = quickSearch.trim();
    if (/^\d{5}$/.test(zip)) {
      navigate(`/weather/${zip}`);
      setQuickSearch("");
    }
  };

  return (
    <header className="bg-carbon-gray-100 text-white sticky top-0 z-50">
      {/* Main header bar */}
      <div className="flex items-center h-12 px-4">
        {/* Menu button (mobile) */}
        <button
          className="lg:hidden flex items-center justify-center w-12 h-12 -ml-4 hover:bg-carbon-gray-80 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white no-underline mr-8 flex-shrink-0"
        >
          <div className="flex items-center justify-center w-6 h-6">
            <Cloud size={20} className="text-carbon-blue-40" />
          </div>
          <span className="text-sm font-semibold tracking-wide">
            Forecast<span className="text-carbon-blue-40">4U</span>
          </span>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          <Link
            to="/"
            className="flex items-center h-12 px-4 text-sm text-carbon-gray-30 hover:bg-carbon-gray-80 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/weather/10001"
            className="flex items-center h-12 px-4 text-sm text-carbon-gray-30 hover:bg-carbon-gray-80 hover:text-white transition-colors"
          >
            Example: NYC
          </Link>
          <Link
            to="/weather/90210"
            className="flex items-center h-12 px-4 text-sm text-carbon-gray-30 hover:bg-carbon-gray-80 hover:text-white transition-colors"
          >
            Example: Beverly Hills
          </Link>
        </nav>

        {/* Contact Support ghost button (desktop) */}
        <a
          href="mailto:support@forecast4u.com"
          aria-label="Contact Support"
          className="hidden lg:flex items-center gap-2 ml-auto mr-3 px-3 h-8 text-xs text-carbon-gray-30 border border-carbon-gray-60 hover:bg-carbon-gray-80 hover:text-white hover:border-carbon-gray-40 transition-colors flex-shrink-0"
        >
          <LifeBuoy size={14} />
          <span>Contact Support</span>
        </a>

        {/* Quick search (desktop) */}
        <form
          onSubmit={handleQuickSearch}
          className="hidden lg:flex items-center"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Enter ZIP..."
              maxLength={5}
              className="bg-carbon-gray-80 text-white placeholder-carbon-gray-40 text-sm px-4 py-2 pr-10 w-36 border-b border-carbon-gray-60 focus:border-carbon-blue-40 outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 text-carbon-gray-40 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-carbon-gray-90 border-t border-carbon-gray-80">
          <nav className="flex flex-col">
            <Link
              to="/"
              className="px-4 py-3 text-sm text-carbon-gray-30 hover:bg-carbon-gray-80 hover:text-white border-b border-carbon-gray-80 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/weather/10001"
              className="px-4 py-3 text-sm text-carbon-gray-30 hover:bg-carbon-gray-80 hover:text-white border-b border-carbon-gray-80 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Example: NYC (10001)
            </Link>
            <Link
              to="/weather/90210"
              className="px-4 py-3 text-sm text-carbon-gray-30 hover:bg-carbon-gray-80 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Example: Beverly Hills (90210)
            </Link>
          </nav>
          {/* Contact Support (mobile) */}
            <a
              href="mailto:support@forecast4u.com"
              aria-label="Contact Support"
              className="flex items-center gap-2 px-4 py-3 text-sm text-carbon-gray-30 hover:bg-carbon-gray-80 hover:text-white border-b border-carbon-gray-80 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <LifeBuoy size={15} />
              <span>Contact Support</span>
            </a>

          {/* Mobile quick search */}
          <form
            onSubmit={(e) => {
              handleQuickSearch(e);
              setMenuOpen(false);
            }}
            className="flex items-center border-t border-carbon-gray-80"
          >
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Enter 5-digit ZIP code..."
              maxLength={5}
              className="flex-1 bg-carbon-gray-80 text-white placeholder-carbon-gray-50 text-sm px-4 py-3 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-carbon-blue-60 text-white text-sm hover:bg-carbon-blue-70 transition-colors"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
