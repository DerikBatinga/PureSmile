/* ===================================================================
   PURE SMILE — THEME ENGINE
   Aplicado o quanto antes (ver script inline no <head>) para evitar
   flash de tema errado. Este arquivo só cuida da interação do botão.
=================================================================== */
(function(){
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ps-theme', theme);
    document.querySelectorAll('[data-theme-icon]').forEach(el=>{
      el.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
    });
  }

  window.PSTheme = {
    toggle(){
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    },
    init(){
      const saved = localStorage.getItem('ps-theme');
      applyTheme(saved || document.documentElement.getAttribute('data-theme') || 'light');
      document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn=>{
        btn.addEventListener('click', ()=> window.PSTheme.toggle());
      });
    }
  };
})();
