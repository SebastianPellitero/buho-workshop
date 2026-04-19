"use client";

import { useState, useEffect } from "react";

type Simulation = "none" | "timeout" | "stock" | "payment" | "offline";

const STORAGE_KEY = "buho_dev_sim";

export function getActiveSimulation(): Simulation {
  if (typeof window === "undefined") return "none";
  return (localStorage.getItem(STORAGE_KEY) as Simulation) ?? "none";
}

export default function DevErrorPanel() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Simulation>("none");

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const hasParam = new URLSearchParams(window.location.search).has("dev");
    setVisible(isDev || hasParam);
    setActive(getActiveSimulation());
  }, []);

  if (!visible) return null;

  function toggle(sim: Simulation) {
    const next = active === sim ? "none" : sim;
    setActive(next);
    localStorage.setItem(STORAGE_KEY, next);

    if (next === "offline") {
      // Monkey-patch fetch to reject
      (window as Window & { __origFetch?: typeof fetch }).__origFetch =
        (window as Window & { __origFetch?: typeof fetch }).__origFetch ?? window.fetch;
      window.fetch = () => Promise.reject(new Error("Simulated network offline"));
    } else if (active === "offline") {
      const w = window as Window & { __origFetch?: typeof fetch };
      if (w.__origFetch) window.fetch = w.__origFetch;
    }
  }

  const simulations: { id: Simulation; label: string; description: string }[] = [
    { id: "timeout", label: "API Timeout", description: "Delays all RTK Query responses by 5s" },
    { id: "stock", label: "Stock Conflict", description: "Next stock check returns 0 qty" },
    { id: "payment", label: "Payment Failure", description: "Stripe returns declined card error" },
    { id: "offline", label: "Network Offline", description: "Disables fetch globally" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-72 rounded-xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
          <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="ml-2 text-xs font-mono text-zinc-300">dev panel</span>
            </div>
            {active !== "none" && (
              <span className="text-xs text-yellow-400 font-mono">SIM ACTIVE</span>
            )}
          </div>

          <div className="p-3 flex flex-col gap-2">
            {simulations.map((sim) => (
              <button
                key={sim.id}
                onClick={() => toggle(sim.id)}
                className={[
                  "flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer",
                  active === sim.id
                    ? "border-red-400 bg-red-50"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50",
                ].join(" ")}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900">{sim.label}</span>
                  {active === sim.id && (
                    <span className="text-xs font-medium text-red-600">ON</span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 mt-0.5">{sim.description}</span>
              </button>
            ))}

            {active !== "none" && (
              <button
                onClick={() => toggle("none")}
                className="mt-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Reset all simulations
              </button>
            )}
          </div>

          <div className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-400">
            Hidden in production · visible with ?dev=true
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all cursor-pointer",
          active !== "none"
            ? "bg-red-600 text-white animate-pulse"
            : "bg-zinc-900 text-white hover:bg-zinc-700",
        ].join(" ")}
        title="Dev Error Panel"
        aria-label="Toggle dev error panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
