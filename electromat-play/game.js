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
  const BOLT = "assets/brand/bolt-red.svg";

  const BUILD = {
    dc: { id: "dc", name: "DC CHARGER", cost: 180000, months: 2, icon: "assets/station.svg", unique: false },
    mcs: { id: "mcs", name: "MCS", cost: 420000, months: 3, icon: "assets/station.svg", unique: false },
    bess: { id: "bess", name: "BESS", cost: 650000, months: 4, icon: "assets/bess.svg", unique: true },
    lounge: { id: "lounge", name: "LOUNGE", cost: 280000, months: 3, icon: "assets/lounge.svg", unique: true },
    market: { id: "market", name: "MARKET", cost: 220000, months: 2, icon: "assets/market.svg", unique: true }
  };

  const RIVALS = {
    voltspan: { id: "voltspan", name: "VOLTSPAN", color: "#00D4F5", home: "la", unlock: 0, priceBias: 1.08 },
    gridhawk: { id: "gridhawk", name: "GRIDHAWK", color: "#E89A2E", home: "dallas", unlock: 0, priceBias: 0.9 },
    arcway: { id: "arcway", name: "ARCWAY", color: "#B8BCC0", home: "denver", unlock: 0, priceBias: 1.02 },
    rednode: { id: "rednode", name: "REDNODE", color: "#B8BCC0", home: "vegas", unlock: 18, priceBias: 0.94 },
    ampfield: { id: "ampfield", name: "AMPFIELD", color: "#00D4F5", home: "albuquerque", unlock: 24, priceBias: 1.0 }
  };

  const CITIES = [
    { id: "sacramento", name: "Sacramento", state: "CA", x: 130, y: 230, demand: 90, truck: 25, land: 1.15, neighbors: ["reno", "la"] },
    { id: "reno", name: "Reno", state: "NV", x: 230, y: 175, demand: 55, truck: 30, land: 0.9, neighbors: ["sacramento", "vegas", "slc"] },
    { id: "slc", name: "Salt Lake City", state: "UT", x: 400, y: 130, demand: 95, truck: 40, land: 1.05, neighbors: ["reno", "stgeorge", "grandjunction", "denver"] },
    { id: "grandjunction", name: "Grand Junction", state: "CO", x: 520, y: 210, demand: 40, truck: 35, land: 0.82, neighbors: ["denver", "flagstaff", "santafe", "slc"] },
    { id: "denver", name: "Denver", state: "CO", x: 640, y: 155, demand: 120, truck: 35, land: 1.2, neighbors: ["santafe", "grandjunction", "slc"] },
    { id: "la", name: "Los Angeles", state: "CA", x: 155, y: 430, demand: 210, truck: 55, land: 1.7, neighbors: ["vegas", "sandiego", "sacramento"] },
    { id: "vegas", name: "Las Vegas", state: "NV", x: 300, y: 330, demand: 140, truck: 50, land: 1.35, neighbors: ["phoenix", "la", "stgeorge", "reno"] },
    { id: "stgeorge", name: "St. George", state: "UT", x: 360, y: 285, demand: 45, truck: 28, land: 0.85, neighbors: ["vegas", "flagstaff", "slc"] },
    { id: "flagstaff", name: "Flagstaff", state: "AZ", x: 400, y: 370, demand: 50, truck: 22, land: 0.88, neighbors: ["phoenix", "stgeorge", "grandjunction"] },
    { id: "phoenix", name: "Phoenix", state: "AZ", x: 420, y: 455, demand: 150, truck: 45, land: 1.0, neighbors: ["tucson", "flagstaff", "vegas", "albuquerque"] },
    { id: "sandiego", name: "San Diego", state: "CA", x: 175, y: 535, demand: 130, truck: 30, land: 1.4, neighbors: ["la", "tucson"] },
    { id: "tucson", name: "Tucson", state: "AZ", x: 455, y: 545, demand: 80, truck: 30, land: 0.92, neighbors: ["phoenix", "elpaso", "sandiego"] },
    { id: "santafe", name: "Santa Fe", state: "NM", x: 600, y: 330, demand: 48, truck: 18, land: 0.95, neighbors: ["albuquerque", "denver", "grandjunction"] },
    { id: "albuquerque", name: "Albuquerque", state: "NM", x: 580, y: 420, demand: 85, truck: 40, land: 0.98, neighbors: ["phoenix", "santafe", "elpaso", "dallas"] },
    { id: "elpaso", name: "El Paso", state: "TX", x: 590, y: 560, demand: 75, truck: 55, land: 0.9, neighbors: ["tucson", "albuquerque", "dallas"] },
    { id: "dallas", name: "Dallas", state: "TX", x: 900, y: 430, demand: 170, truck: 80, land: 1.25, neighbors: ["albuquerque", "elpaso"] }
  ];
  const CITY_BY_ID = Object.fromEntries(CITIES.map((c) => [c.id, c]));
  function emptySite() { return { dc: 0, mcs: 0, bess: 0, lounge: 0, market: 0 }; }
  function factionIds() { return [YOU, ...Object.keys(RIVALS)]; }
  function hasCap(site) { return site.dc + site.mcs > 0; }
  function capacity(site) { return site.dc * 1 + site.mcs * 2.35 + site.bess * 0.35; }
  function tickMonth() { if (!state || state.over) return; state.month += 1; }
  function zapsCompound(city) { const site = city.sites[YOU]; return '<svg class="compound-svg"></svg>'; }
  function boot() { }
  let state = null;
  boot();
})();
