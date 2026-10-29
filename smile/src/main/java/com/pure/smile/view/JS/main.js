// ====================================================================
// PURE SMILE — Lógica do tema claro/escuro
// --------------------------------------------------------------------
// init() = configuração inicial: acha os elementos, sincroniza o estado
// e liga os eventos. Roda UMA vez, no início.
// ====================================================================

function init() {

    const botao = document.querySelector('[data-action="toggle-tema"]');
    const atual = document.querySelector('[data-theme-icon]');

    // Se o botão não existe na página, pula (ex: login, ou layout.js cuida)
    if (!botao || !atual) return;

    atual.className = document.documentElement.getAttribute('data-theme') === 'dark' ? 'ri-sun-line' : 'ri-moon-line';

    botao.addEventListener('click', function () {
        const temaAtual = document.documentElement.getAttribute('data-theme');
        const novoTema = temaAtual === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', novoTema);
        localStorage.setItem('ps-tema', novoTema);
        atual.className = novoTema === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
    });
}

// Roda o init quando a página termina de carregar o DOM.
// Assim o script funciona em qualquer posição do HTML (head ou body).
document.addEventListener('DOMContentLoaded', init);
