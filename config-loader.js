/**
 * AURELIUS SECUNDUS — Config Loader
 * Source : macdubh28.github.io/dashboard/config.json
 */
(function () {
  const CONFIG_URL = 'https://macdubh28.github.io/dashboard/config.json';

  async function loadConfig() {
    try {
      const res = await fetch(CONFIG_URL + '?t=' + Date.now());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      console.warn('[ConfigLoader] Erreur :', e.message);
      return null;
    }
  }

  function applyQuote(cfg) {
    const q = cfg?.global?.quoteOfDay;
    if (!q) return;
    document.querySelectorAll('[data-config="quote-text"]').forEach(el => { el.textContent = q.text; });
    document.querySelectorAll('[data-config="quote-author"]').forEach(el => {
      el.textContent = '— ' + q.author + (q.source ? ', ' + q.source : '');
    });
  }

  function applyMaintenance(cfg, platformKey) {
    const p = cfg?.platforms?.[platformKey];
    if (!p || !p.maintenanceMode) return;
    const main = document.getElementById('main-content') || document.querySelector('main');
    if (main) main.style.display = 'none';
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0a0a0a;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Cinzel,serif;color:#C9A84C;text-align:center;padding:2rem;';
    banner.innerHTML = '<div style="font-size:3rem;margin-bottom:1rem;">⚡</div><div style="font-size:1.2rem;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:1rem;">' + (p.title || platformKey) + '</div><div style="font-size:0.9rem;color:rgba(245,240,232,0.7);max-width:480px;line-height:1.8;font-family:Crimson Text,serif;font-style:italic;margin-bottom:2rem;">' + (p.maintenanceMessage || 'Maintenance en cours.') + '</div><div style="font-size:0.6rem;letter-spacing:0.25em;color:rgba(201,168,76,0.4);text-transform:uppercase;">Aurelius Secundus · Morale de Ghost</div>';
    document.body.prepend(banner);
  }

  function applyMeta(cfg, platformKey) {
    const p = cfg?.platforms?.[platformKey];
    if (!p) return;
    document.querySelectorAll('[data-config="platform-title"]').forEach(el => { el.textContent = p.title; });
    document.querySelectorAll('[data-config="platform-tagline"]').forEach(el => { el.textContent = p.tagline; });
  }

  window.AureliusConfig = {
    init: async function (platformKey) {
      const cfg = await loadConfig();
      if (!cfg) return;
      applyMaintenance(cfg, platformKey);
      applyQuote(cfg);
      applyMeta(cfg, platformKey);
      document.dispatchEvent(new CustomEvent('aurelius:config', { detail: cfg }));
    },
    get: loadConfig
  };

  document.addEventListener('DOMContentLoaded', () => {
    const key = document.body.dataset.platform;
    if (key) window.AureliusConfig.init(key);
  });
})();
