import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { commands } from "../bindings";
import { GenericAutoTable } from "../components/features/GenericAutoTable";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState("typing");
  const [result, setResult] = useState<any[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    setHasSubmitted(true);

    try {
      const response = await commands.runUncheckedDbQuery(answer);

      if (response && Array.isArray(response.data)) {
        setResult(response.data);
      } else if (Array.isArray(response)) {
        setResult(response);
      } else {
        setResult([]);
      }

      setStatus("typing");
    } catch (err: any) {
      setStatus("typing");
      setError(err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Scanline effect overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
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

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
        {/* Header - raw typography */}
        <div className="mb-16 border-b border-white/10 pb-12">
          <div className="mb-4">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-4 uppercase">
              SQL RUNNER
            </h1>
            <div className="w-12 h-1 bg-white/80 mb-6"></div>
            <p className="text-sm text-white/60 uppercase tracking-widest max-w-md leading-relaxed">
              Execute SQL Queries to get any statistics you need.
            </p>
          </div>
        </div>

        {/* Query Editor Section */}
        <form onSubmit={handleSubmit} className="mb-16">
          {/* Label */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Query Input</span>
            <span className="text-xs text-white/30">{answer.length} / 4096</span>
          </div>

          {/* Editor container - brutal border */}
          <div className="border-2 border-white/20 bg-black relative">
            {/* Line numbers aesthetic */}
            <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-white/10 bg-white/2 flex flex-col text-right text-xs text-white/20 py-4 pr-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              className="w-full pl-16 pr-6 py-4 bg-black text-white/90 font-mono text-sm placeholder-white/20 resize-none focus:outline-none h-48 leading-relaxed"
              placeholder="SELECT * FROM matches WHERE region = 'NA';"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={status === "submitting"}
              spellCheck="false"
            />
          </div>

          {/* Character count and status */}
          <div className="mt-3 flex items-center justify-between text-xs text-white/40">
            <span>Ready to execute</span>
            <span className="uppercase tracking-widest">DuckDB / PostgreSQL Compatible</span>
          </div>

          {/* Submit Button - stark */}
          <div className="mt-8 flex gap-4">
            <button
              className="flex-1 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/90 active:bg-white/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-2 border-white"
              disabled={answer.length === 0 || status === "submitting"}
              type="submit"
            >
              {status === "submitting" ? "EXECUTING..." : "EXECUTE"}
            </button>
            <button
              className="px-8 py-4 bg-black text-white border-2 border-white/30 font-bold uppercase tracking-widest text-sm hover:border-white/60 transition-colors"
              type="button"
              onClick={() => setAnswer("")}
            >
              CLEAR
            </button>
          </div>

          {/* Error display */}
          {error !== null && (
            <div className="mt-8 border-2 border-white/30 bg-black p-6 animate-slideDown">
              <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2">ERROR</div>
              <p className="text-sm text-white/60 font-mono mb-4">
                {error.message || "An unknown error occurred"}
              </p>
              <button
                onClick={() => {
                  setError(null);
                  setResult([]);
                  setHasSubmitted(false);
                }}
                className="text-xs text-white/50 hover:text-white/80 uppercase font-bold tracking-widest"
              >
                Dismiss
              </button>
            </div>
          )}
        </form>

        {/* Results Section */}
        {hasSubmitted && error === null && (
          <div className="animate-slideDown">
            {/* Results header */}
            <div className="mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Results</h2>
                <span className="text-xs text-white/40 uppercase tracking-widest">
                  {result.length} rows
                </span>
              </div>
            </div>

            {/* Table or empty state */}
            {result.length > 0 ? (
              <div className="border-2 border-white/10 bg-black overflow-hidden">
                <GenericAutoTable data={result} />
              </div>
            ) : (
              <div className="border-2 border-white/10 bg-black/50 p-16 text-center">
                <p className="text-sm text-white/40 uppercase tracking-widest font-mono">
                  No records returned
                </p>
              </div>
            )}
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
