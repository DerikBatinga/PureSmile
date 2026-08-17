/* =====================================================================
   LAYOUT.JS — Motor de Sidebar + Topbar
   Monta a navegação lateral e a barra superior de acordo com o perfil
   logado (dentista, funcionario, admin, paciente).
   Cada página só precisa chamar PSLayout.render() com seu nome.
===================================================================== */

/* ---------- Navegação por perfil ----------
   Cada perfil tem suas seções e itens.
   href = arquivo HTML destino (mesmo diretório).
   icon = classe Remix Icon.
   O item com href igual à página atual recebe .is-active automaticamente.
===================================================================== */
const PS_NAV = {
    dentista: [
        { section: "Geral", items: [
            { href: "dashboard.html", icon: "ri-dashboard-3-line", label: "Dashboard" },
        ]},
        { section: "Clínico", items: [
            { href: "agenda.html", icon: "ri-calendar-2-line", label: "Agenda" },
            { href: "procedimentos.html", icon: "ri-tooth-line", label: "Procedimentos" },
            { href: "pacientes.html", icon: "ri-group-line", label: "Pacientes" },
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
            { href: "agenda.html", icon: "ri-calendar-2-line", label: "Agenda" },
            { href: "pacientes.html", icon: "ri-group-line", label: "Pacientes" },
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
            { href: "agenda.html", icon: "ri-calendar-2-line", label: "Agenda" },
            { href: "pacientes.html", icon: "ri-group-line", label: "Pacientes" },
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

/* Nome de exibição de cada perfil */
const PS_ROLE_LABEL = {
    dentista: "Dentista",
    funcionario: "Secretária",
    admin: "Administrador",
    paciente: "Paciente",
};

/* ---------- Motor principal ---------- */
const PSLayout = {

    /* Lê o perfil salvo no login (Parte 1) */
    getRole() {
        return localStorage.getItem('ps-role') || 'dentista';
    },

    /* Dados fictícios do usuário logado (avatar, nome, cargo) */
    getUser() {
        const role = this.getRole();
        const map = {
            dentista:    { name: "Dra. Camila Ferraz",  meta: "Ortodontia",    avatar: "https://i.pravatar.cc/100?img=47" },
            funcionario: { name: "Ana Beatriz Lima",     meta: "Secretária",    avatar: "https://i.pravatar.cc/100?img=44" },
            admin:       { name: "Rodrigo Fialho",       meta: "Administrador", avatar: "https://i.pravatar.cc/100?img=68" },
            paciente:    { name: "Marina Souza Alves",   meta: "Paciente",      avatar: "https://i.pravatar.cc/100?img=5"  },
        };
        return map[role] || map.dentista;
    },

    /* ==================================================================
       render(activePage, pageTitle, crumb)
       Monta sidebar + topbar no DOM. Chame uma vez por página.
       - activePage: nome do arquivo (ex: "agenda.html")
       - pageTitle:  título exibido na topbar (ex: "Agenda")
       - crumb:      descrição abaixo do título (ex: "Sua agenda da semana")
    ================================================================== */
    render(activePage, pageTitle, crumb) {
        const role = this.getRole();
        const user = this.getUser();
        const nav = PS_NAV[role] || PS_NAV.dentista;

        /* Aplica estado recolhido da sidebar (salvo no clique) */
        const shell = document.getElementById('ps-app-shell');
        if (shell) {
            const collapsed = localStorage.getItem('ps-sidebar-collapsed') === '1';
            shell.classList.toggle('is-collapsed', collapsed);
        }

        /* ---------- SIDEBAR ---------- */
        const sidebarEl = document.getElementById('ps-sidebar');
        if (sidebarEl) {
            sidebarEl.innerHTML = `
                <div class="sidebar__brand">
                    <div class="sidebar__mark"><img src="../IMG/pureSmile.png" alt="Pure Smile"></div>
                    <div class="sidebar__brand-text">
                        <strong>Pure Smile</strong>
                        <span>${PS_ROLE_LABEL[role] || role}</span>
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
        }

        /* ---------- TOPBAR ---------- */
        const topbarEl = document.getElementById('ps-topbar');
        if (topbarEl) {
            topbarEl.innerHTML = `
                <div>
                    <div class="topbar__title">${pageTitle}</div>
                    ${crumb ? `<div class="topbar__crumb">${crumb}</div>` : ''}
                </div>
                <div class="topbar__search">
                    <i class="ri-search-line"></i>
                    <input type="text" placeholder="Buscar pacientes, consultas..." />
                </div>
                <div class="topbar__actions">
                    <button class="icon-btn" data-action="toggle-tema">
                        <i data-theme-icon class="ri-moon-line"></i>
                    </button>
                    <div class="dropdown" id="ps-notif-dropdown">
                        <button class="icon-btn" data-action="toggle-dropdown" data-target="ps-notif-dropdown">
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
                            <div class="dropdown__divider"></div>
                            <div class="dropdown__item danger" data-action="logout"><i class="ri-logout-box-r-line"></i> Sair</div>
                        </div>
                    </div>
                </div>
            `;
        }

        /* Liga os eventos e animações */
        this.bindEvents();
        this.initTheme();
        this.entranceAnim();
    },

    /* ---------- TEMA CLARO/ESCURO ----------
       Sincroniza o ícone do botão e liga o clique.
       Usa a mesma chave 'ps-tema' do main.js.
    ================================================== */
    initTheme() {
        const saved = localStorage.getItem('ps-tema') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);

        /* Atualiza todos os ícones de tema na página */
        const syncIcons = (theme) => {
            document.querySelectorAll('[data-theme-icon]').forEach(el => {
                el.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
            });
        };
        syncIcons(saved);

        /* Liga o clique em todos os botões de tema */
        document.querySelectorAll('[data-action="toggle-tema"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('ps-tema', next);
                syncIcons(next);
            });
        });
    },

    /* ---------- EVENTOS DA SIDEBAR/TOPBAR ---------- */
    bindEvents() {
        /* Recolher/expandir sidebar */
        document.querySelectorAll('[data-action="toggle-sidebar"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const shell = document.getElementById('ps-app-shell');
                shell.classList.toggle('is-collapsed');
                localStorage.setItem('ps-sidebar-collapsed',
                    shell.classList.contains('is-collapsed') ? '1' : '0');
            });
        });

        /* Abrir/fechar dropdowns (notificações, avatar) */
        document.querySelectorAll('[data-action="toggle-dropdown"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = document.getElementById(btn.dataset.target);
                const wasOpen = target.classList.contains('is-open');
                /* Fecha todos os outros */
                document.querySelectorAll('.dropdown.is-open').forEach(d => d.classList.remove('is-open'));
                if (!wasOpen) target.classList.add('is-open');
            });
        });

        /* Fecha dropdowns ao clicar fora */
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown.is-open').forEach(d => d.classList.remove('is-open'));
        });

        /* Logout: limpa sessão e volta pro login */
        document.querySelectorAll('[data-action="logout"]').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        });
    },

    /* ---------- ANIMAÇÃO DE ENTRADA (GSAP) ---------- */
    entranceAnim() {
        if (typeof gsap === 'undefined') return;
        gsap.from('.sidebar .nav-item', { opacity: 0, x: -12, stagger: 0.035, duration: 0.45, ease: 'power2.out' });
        gsap.from('.sidebar__brand', { opacity: 0, y: -8, duration: 0.4, ease: 'power2.out' });
        gsap.from('.topbar', { opacity: 0, y: -10, duration: 0.4, ease: 'power2.out' });
    },
};

/* ==================================================================
   INIT — Roda quando a página carrega
   1) Guarda de sessão: sem login, volta para login.html
   2) Detecta a página atual pelo URL e monta o shell
===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    /* Guard: se não tem perfil salvo e não é página pública, volta pro login */
    if (!localStorage.getItem('ps-role') && !document.body.hasAttribute('data-public-page')) {
        window.location.href = 'login.html';
        return;
    }

    /* Detecta a página atual pelo nome do arquivo */
    const page = location.pathname.split('/').pop();

    /* Título e breadcrumb de cada página */
    const pageConfig = {
        'dashboard.html':  { title: 'Dashboard',  crumb: 'Visão geral do sistema' },
        'agenda.html':     { title: 'Agenda',      crumb: 'Sua agenda da semana' },
        'pacientes.html':  { title: 'Pacientes',   crumb: 'Lista de pacientes' },
        'procedimentos.html': { title: 'Procedimentos', crumb: 'Cadastros clínicos' },
        'pagamentos.html': { title: 'Pagamentos',  crumb: 'Financeiro' },
        'perfil.html':     { title: 'Meu Perfil',  crumb: 'Dados do usuário logado' },
        'configuracoes.html': { title: 'Configurações', crumb: 'Sistema' },
    };

    const config = pageConfig[page] || { title: 'Pure Smile', crumb: '' };
    PSLayout.render(page, config.title, config.crumb);
});
