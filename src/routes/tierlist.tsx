import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GenericAutoTable } from "../components/features/GenericAutoTable";
import { useItemTierlist, useChampionTierlist, useTierlistChampions } from "../commands/queries";
import { SortingState } from "@tanstack/react-table";

export const Route = createFileRoute("/tierlist")({
  component: TierlistComponent,
});

function TierlistComponent() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeChampion, setActiveChampion] = useState<string | null>(null);

  const generalQuery = useTierlistChampions(activeChampion === null);
  const itemQuery = useItemTierlist(activeChampion ?? "");

  const currentQuery = activeChampion ? itemQuery : generalQuery;
  const { isFetching, error, data } = currentQuery;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveChampion(searchInput.trim());
      setSearchInput("");
    }
  };

  const showGeneralTierlist = () => {
    setActiveChampion(null);
    setSearchInput("");
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Scanline texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.05) 2px,
            rgba(255, 255, 255, 0.05) 4px
          )`
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-16 border-b border-white/10 pb-12">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-4 uppercase">
            CHAMPION TIERS
          </h1>
          <div className="w-12 h-1 bg-white/80 mb-6"></div>
          <p className="text-sm text-white/60 uppercase tracking-widest max-w-2xl leading-relaxed">
            Ranked statistics. Performance metrics. Item builds analyzed. Click champion for detailed breakdown.
          </p>
        </div>

        {/* Controls - stark layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* General button */}
          <button
            onClick={showGeneralTierlist}
            className={`py-4 px-6 font-black text-xs uppercase tracking-widest transition-colors border-2 ${activeChampion === null
              ? "bg-white text-black border-white"
              : "bg-black text-white/70 border-white/20 hover:border-white/50"
              }`}
          >
            ALL CHAMPIONS
          </button>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search champion..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="col-span-1 md:col-span-1 px-6 py-4 bg-black border-2 border-white/20 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors font-mono uppercase"
          />

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={searchInput.length === 0}
            className="py-4 px-6 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-white/90 active:bg-white/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-2 border-white"
          >
            FIND
          </button>
        </div>

        {/* Active champion badge */}
        {activeChampion && (
          <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-black border-2 border-white/30">
            <span className="w-2 h-2 bg-white/80"></span>
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
              Viewing: <span className="text-white">{activeChampion.toUpperCase()}</span>
            </span>
          </div>
        )}

        {/* Loading state */}
        {isFetching && (
          <div className="border-2 border-white/20 bg-black/50 py-20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-white/40 mb-4 font-black">⋮</div>
              <p className="text-xs text-white/40 uppercase tracking-widest">LOADING DATA</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="border-2 border-white/30 bg-black p-8 mb-8 animate-slideDown">
            <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-3">ERROR</div>
            <p className="text-sm text-white/60 font-mono mb-4">{error.message}</p>
            <button
              onClick={() => currentQuery.refetch()}
              className="text-xs text-white/50 hover:text-white/80 uppercase font-bold tracking-widest"
            >
              Retry
            </button>
          </div>
        )}

        {/* Data table */}
        {data && !isFetching && (
          <div className="animate-slideDown">
            <div className="border-2 border-white/10 bg-black overflow-hidden">
              {/* Table header info */}
              <div className="px-6 py-4 border-b-2 border-white/10 bg-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                  {activeChampion ? `ITEMS FOR ${activeChampion.toUpperCase()}` : 'ALL CHAMPIONS'}
                </span>
                <span className="text-xs text-white/30">{data.data.length} TOTAL</span>
              </div>

              {/* Table */}
              <GenericAutoTable
                data={data.data}
                sorting={sorting}
                onSortingChange={setSorting}
                onRowClick={(row) => {
                  const championName = row.champion_name; // adjust field name as needed
                  if (championName) setActiveChampion(championName);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
