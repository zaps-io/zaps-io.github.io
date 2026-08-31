/* ZAPS EMPIRE — Civ / C&C charging-continent board. Not the night-shift walk. */
(() => {
  const SAVE_KEY = "zaps-empire-v2";
  const SAVE_LEGACY = "zaps-empire-v1";
  const YOU = "zaps";
  const TICK = { 0: 0, 1: 1800, 2: 900, 4: 450 };
  const MAX_CREWS = 3;
  const PAL = {
    red: "#E63225",
    charcoal: "#1E1E24",
    amber: "#E89A2E",
    cyan: "#00D4F5",
    cream: "#F5F0E8",
    steel: "#B8BCC0",
    pad: "#F5F0E8",
    dirt: "#1E1E24",
    ink: "#121217",
    panel: "#26262e",
    lot: "#F5F0E8",
  };
  const BOLT = "assets/brand/zaps-wordmark-only-red.svg";
  const BUILD = {
    dc: { id: "dc", name: "DC CHARGER", cost: 180000, months: 2, icon: "assets/station.svg", unique: false },
    mcs: { id: "mcs", name: "MCS", cost: 420000, months: 3, icon: "assets/station.svg", unique: false },
    bess: { id: "bess", name: "BESS", cost: 650000, months: 4, icon: "assets/bess.svg", unique: true },
    lounge: { id: "lounge", name: "LOUNGE", cost: 280000, months: 3, icon: "assets/lounge.svg", unique: true },
    market: { id: "market", name: "MARKET", cost: 220000, months: 2, icon: "assets/market.svg", unique: true }
  };
  boot();
})();
