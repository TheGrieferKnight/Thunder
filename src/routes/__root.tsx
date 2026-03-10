import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Aggressive dark background with minimal texture */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`
        }}></div>
      </div>

      {/* Brutal edge accent - structural, not decorative */}
      <div className="fixed top-0 left-0 right-0 h-px bg-white/20"></div>

      {/* Navigation - Raw brutalism */}
      <nav className="relative z-50 border-b border-white/10 bg-black">
        <div className="max-w-full px-8 py-6">
          <div className="flex justify-between items-center">
            {/* Branding - stark and minimal */}
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 border-2 border-white/80 flex items-center justify-center">
                <div className="w-2 h-2 bg-white/80"></div>
              </div>
              <span className="text-xl font-black tracking-wider text-white/90 uppercase">
                EPISCHE FACHARBEIT 123
              </span>
              <span className="text-xs text-white/30 uppercase tracking-[0.2em]">v1.0</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-0">
              <NavLink to="/" label="RUNNER" />
              <NavLink to="/tierlist" label="TIERS" />
              <NavLink to="/settings" label="CONFIG" />
              <NavLink
                to="/items/$id"
                params={{ id: "1" }}
                label="DEBUG"
              />
            </div>

            {/* Mobile Menu Button - severe */}
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="md:hidden p-3 border border-white/20 hover:border-white/50 transition-colors"
            >
              <div className="w-4 h-3 flex flex-col justify-between">
                <span className={`h-px bg-white/80 transition-all ${navOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`h-px bg-white/80 transition-all ${navOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-px bg-white/80 transition-all ${navOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation - stacked brutal */}
          {navOpen && (
            <div className="md:hidden mt-6 pt-6 border-t border-white/10 space-y-0">
              <MobileNavLink to="/" label="RUNNER" onClick={() => setNavOpen(false)} />
              <MobileNavLink to="/tierlist" label="TIERS" onClick={() => setNavOpen(false)} />
              <MobileNavLink to="/settings" label="CONFIG" onClick={() => setNavOpen(false)} />
              <MobileNavLink
                to="/items/$id"
                params={{ id: "1" }}
                label="DEBUG"
                onClick={() => setNavOpen(false)}
              />
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Footer accent */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-white/10"></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Courier+Prime:wght@400;700&display=swap');

        * {
          font-family: 'IBM Plex Mono', 'Courier Prime', monospace;
          letter-spacing: 0.02em;
        }

        /* Remove any default smoothing */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Aggressive line-height for monospace */
        body {
          line-height: 1.6;
          letter-spacing: 0.015em;
        }

        /* Custom selection - stark */
        ::selection {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        /* Link reset */
        a {
          text-decoration: none;
          color: inherit;
        }

        /* Scrollbar - minimal */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: black;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* Focus styles - visible but minimal */
        a:focus-visible,
        button:focus-visible {
          outline: 1px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }

        /* Animation - purpose-driven only */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

/**
 * Desktop Navigation Link - industrial aesthetic
 */
function NavLink({
  to,
  label,
  params,
}: {
  to: string;
  label: string;
  params?: Record<string, string>;
}) {
  return (
    <Link
      to={to}
      params={params}
      className="relative px-6 py-3 text-xs font-bold text-white/70 hover:text-white/100 transition-colors uppercase tracking-widest border-r border-white/5 last:border-r-0"
      activeProps={{
        className:
          "text-white/100 bg-white/5 border-r border-white/5 last:border-r-0",
      }}
    >
      {label}

      {/* Underline indicator on active */}
      <style>{`
        a[class*="active"]::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </Link>
  );
}

/**
 * Mobile Navigation Link - stacked brutalism
 */
function MobileNavLink({
  to,
  label,
  params,
  onClick,
}: {
  to: string;
  label: string;
  params?: Record<string, string>;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      params={params}
      onClick={onClick}
      className="block px-2 py-3 text-xs font-bold text-white/70 hover:text-white/100 hover:bg-white/5 transition-colors uppercase tracking-widest border-b border-white/5"
      activeProps={{
        className:
          "text-white/100 bg-white/5 border-b border-white/5",
      }}
    >
      {label}
    </Link>
  );
}
