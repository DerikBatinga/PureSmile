/* ===================================================================
   PURE SMILE — LAYOUT ENGINE
   Monta sidebar + topbar de acordo com o perfil autenticado.
   Isso simula, no front-end, a regra de negócio que no back-end
   (Java) virá de uma checagem de perfil/role na sessão do usuário.
=================================================================== */

const PS_NAV = {
  dentista: [
    { section: "Geral", items: [
      { href: "dashboard.html", icon: "ri-dashboard-3-line", label: "Dashboard" },
    ]},
    { section: "Clínico", items: [
      { href: "pacientes.html", icon: "ri-group-line", label: "Pacientes" },
      { href: "agenda.html", icon: "ri-calendar-2-line", label: "Agenda" },
      { href: "procedimentos.html", icon: "ri-tooth-line", label: "Procedimentos" },
    ]},
    { section: "Conta", items: [
      { href: "perfil.html", icon: "ri-user-3-line", label: "Perfil" },
    ]},
  ],
  funcionario: [
    { section: "Geral", items: [
      { href: "dashboard.html", icon: "ri-dashboard-3-line", label: "Dashboard" },
    ]},
    { section: "Operação", items: [
      { href: "pacientes.html", icon: "ri-group-line", label: "Pacientes" },
      { href: "agenda.html", icon: "ri-calendar-2-line", label: "Agenda" },
      { href: "pagamentos.html", icon: "ri-bank-card-line", label: "Pagamentos" },
    ]},
    { section: "Conta", items: [
      { href: "perfil.html", icon: "ri-user-3-line", label: "Perfil" },
    ]},
  ],
  admin: [
    { section: "Geral", items: [
      { href: "dashboard.html", icon: "ri-dashboard-3-line", label: "Dashboard" },
    ]},
    { section: "Gestão", items: [
      { href: "pacientes.html", icon: "ri-group-line", label: "Pacientes" },
      { href: "agenda.html", icon: "ri-calendar-2-line", label: "Agenda" },
      { href: "procedimentos.html", icon: "ri-tooth-line", label: "Procedimentos" },
      { href: "pagamentos.html", icon: "ri-bank-card-line", label: "Pagamentos" },
    ]},
    { section: "Sistema", items: [
      { href: "configuracoes.html", icon: "ri-settings-3-line", label: "Configurações" },
      { href: "perfil.html", icon: "ri-user-3-line", label: "Perfil" },
    ]},
  ],
  paciente: [
    { section: "Geral", items: [
      { href: "dashboard.html", icon: "ri-dashboard-3-line", label: "Início" },
    ]},
    { section: "Minha saúde", items: [
      { href: "agenda.html", icon: "ri-calendar-2-line", label: "Minha Agenda" },
      { href: "procedimentos.html", icon: "ri-tooth-line", label: "Meus Procedimentos" },
      { href: "pagamentos.html", icon: "ri-bank-card-line", label: "Financeiro" },
    ]},
    { section: "Conta", items: [
      { href: "perfil.html", icon: "ri-user-3-line", label: "Perfil" },
    ]},
  ],
};

const PS_ROLE_LABEL = {
  dentista: "Dentista",
  funcionario: "Secretaria",
  admin: "Administrador",
  paciente: "Paciente",
};

const PSLayout = {

  getRole(){
    return localStorage.getItem('ps-role') || 'dentista';
  },

  getUser(){
    const role = this.getRole();
    const map = {
      dentista: { name: "Dra. Camila Ferraz", meta: "Ortodontia", avatar: "https://i.pravatar.cc/100?img=47" },
      funcionario: { name: "Ana Beatriz Lima", meta: "Secretaria", avatar: "https://i.pravatar.cc/100?img=44" },
      admin: { name: "Rodrigo Fialho", meta: "Administrador", avatar: "https://i.pravatar.cc/100?img=68" },
      paciente: { name: "Marina Souza Alves", meta: "Paciente", avatar: "https://i.pravatar.cc/100?img=5" },
    };
    return map[role] || map.dentista;
  },

  render(activePage, pageTitle, crumb){
    const role = this.getRole();
    const user = this.getUser();
    const nav = PS_NAV[role] || PS_NAV.dentista;
    const collapsed = localStorage.getItem('ps-sidebar-collapsed') === '1';

    const shell = document.getElementById('ps-app-shell');
    shell.classList.toggle('is-collapsed', collapsed);

    // ---------- Sidebar ----------
    const sidebarEl = document.getElementById('ps-sidebar');
    sidebarEl.innerHTML = `
      <div class="sidebar__brand">
        <div class="sidebar__mark"><i class="ri-shining-2-fill"></i></div>
        <div class="sidebar__brand-text">
          <strong>Pure Smile</strong>
          <span>${PS_ROLE_LABEL[role]}</span>
        </div>
      </div>
      <nav class="sidebar__nav">
        ${nav.map(group => `
          <div class="sidebar__section-label">${group.section}</div>
          ${group.items.map(item => `
            <a class="nav-item ${item.href === activePage ? 'is-active' : ''}" href="${item.href}">
              <i class="${item.icon}"></i><span>${item.label}</span>
            </a>
          `).join('')}
        `).join('')}
      </nav>
      <div class="sidebar__footer">
        <button class="sidebar__collapse-btn" data-action="toggle-sidebar">
          <i class="ri-side-bar-line"></i><span>Recolher menu</span>
        </button>
        <button class="sidebar__collapse-btn" data-action="logout" style="margin-top:2px;">
          <i class="ri-logout-box-r-line"></i><span>Sair</span>
        </button>
      </div>
    `;

    // ---------- Topbar ----------
    const topbarEl = document.getElementById('ps-topbar');
    topbarEl.innerHTML = `
      <div>
        <div class="topbar__title">${pageTitle}</div>
        ${crumb ? `<div class="topbar__crumb">${crumb}</div>` : ''}
      </div>
      <div class="topbar__search">
        <i class="ri-search-line"></i>
        <input type="text" placeholder="Buscar pacientes, consultas, procedimentos..." />
        <kbd>⌘K</kbd>
      </div>
      <div class="topbar__actions">
        <button class="icon-btn theme-toggle" data-action="toggle-theme" data-tooltip="Alternar tema">
          <i data-theme-icon class="ri-moon-line"></i>
        </button>
        <div class="dropdown" id="ps-notif-dropdown">
          <button class="icon-btn" data-action="toggle-dropdown" data-target="ps-notif-dropdown" data-tooltip="Notificações">
            <i class="ri-notification-3-line"></i><span class="dot"></span>
          </button>
          <div class="dropdown__menu" style="min-width:290px;">
            <div class="dropdown__header">Notificações recentes</div>
            <div class="dropdown__item"><i class="ri-calendar-check-line"></i> Consulta confirmada às 09:30</div>
            <div class="dropdown__item"><i class="ri-money-dollar-circle-line"></i> Pagamento recebido — R$ 780,00</div>
            <div class="dropdown__item"><i class="ri-alert-line"></i> 1 pagamento pendente</div>
            <div class="dropdown__divider"></div>
            <div class="dropdown__item"><i class="ri-checkbox-multiple-line"></i> Marcar todas como lidas</div>
          </div>
        </div>
        <div class="dropdown" id="ps-avatar-dropdown">
          <div class="avatar-menu" data-action="toggle-dropdown" data-target="ps-avatar-dropdown">
            <img class="avatar" src="${user.avatar}" alt="${user.name}">
            <div class="avatar-menu__meta">
              <strong>${user.name}</strong>
              <span>${user.meta}</span>
            </div>
            <i class="ri-arrow-down-s-line text-muted"></i>
          </div>
          <div class="dropdown__menu">
            <div class="dropdown__item" onclick="location.href='perfil.html'"><i class="ri-user-3-line"></i> Meu perfil</div>
            <div class="dropdown__item" onclick="location.href='configuracoes.html'"><i class="ri-settings-3-line"></i> Configurações</div>
            <div class="dropdown__divider"></div>
            <div class="dropdown__item danger" data-action="logout"><i class="ri-logout-box-r-line"></i> Sair</div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    if(window.PSTheme) window.PSTheme.init();
    this.entranceAnim();
  },

  bindEvents(){
    document.querySelectorAll('[data-action="toggle-sidebar"]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const shell = document.getElementById('ps-app-shell');
        shell.classList.toggle('is-collapsed');
        localStorage.setItem('ps-sidebar-collapsed', shell.classList.contains('is-collapsed') ? '1' : '0');
      });
    });

    document.querySelectorAll('[data-action="toggle-dropdown"]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const target = document.getElementById(btn.dataset.target);
        const wasOpen = target.classList.contains('is-open');
        document.querySelectorAll('.dropdown.is-open').forEach(d=>d.classList.remove('is-open'));
        if(!wasOpen) target.classList.add('is-open');
      });
    });
    document.addEventListener('click', ()=>{
      document.querySelectorAll('.dropdown.is-open').forEach(d=>d.classList.remove('is-open'));
    });

    document.querySelectorAll('[data-action="logout"]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        window.location.href = 'index.html';
      });
    });
  },

  entranceAnim(){
    if(typeof gsap === 'undefined') return;
    gsap.from('.sidebar .nav-item', { opacity:0, x:-12, stagger:0.035, duration:.45, ease:'power2.out' });
    gsap.from('.sidebar__brand', { opacity:0, y:-8, duration:.4, ease:'power2.out' });
    gsap.from('.topbar', { opacity:0, y:-10, duration:.4, ease:'power2.out' });
  },
};

document.addEventListener('DOMContentLoaded', ()=>{
  // Guarda simples de sessão: sem login, volta pra tela inicial.
  if(!localStorage.getItem('ps-role') && !document.body.hasAttribute('data-public-page')){
    window.location.href = 'index.html';
  }
});
