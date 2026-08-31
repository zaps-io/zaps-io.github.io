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
  function padSlab(x, y, w, d, live) {
    const p = isoPts(x, y, w, d, 0);
    const fill = live ? "#cfc8ba" : "#2a2a32";
    const edge = live ? PAL.cyan : "rgba(0,212,245,0.4)";
    let g = poly([p.fl, p.fr, p.br, p.bl], fill, edge, 1.1);
    const inset = isoPts(x + 6, y - 3, w - 14, d - 10, 0);
    g += poly([inset.fl, inset.fr, inset.br, inset.bl], live ? "#e8e2d6" : "#32323a", PAL.cyan, 0.45);
    return g;
  }
  boot();
})();
