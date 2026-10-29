/* =====================================================================
   AUXILIARES.JS — Funções pequenas e reutilizáveis
   ---------------------------------------------------------------------
   Aqui ficam funções usadas em várias páginas:
   - formatarMoeda() : transforma 320 em "R$ 320,00"
   - formatarData()  : transforma "2026-07-18" em "18/07/2026"
   - seloStatus()    : devolve o HTML do selo colorido do status
   - mostrarToast()  : mostra uma notificação no canto
   - abrir/fecharModal() : controla as janelas de cadastro

   Colocamos tudo em um objeto chamado AJUDA para não poluir o
   JavaScript global com vários nomes soltos.
   ===================================================================== */

const AJUDA = {

    /* ------------------------------------------------------------------
       FORMATAÇÃO DE MOEDA
       Ex: formatarMoeda(320) → "R$ 320,00"
    ------------------------------------------------------------------ */
    formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    },

    /* ------------------------------------------------------------------
       FORMATAÇÃO DE DATA
       Ex: formatarData("2026-07-18") → "18/07/2026"
       Mas se a data for igual a 01/01/1900 significa "não tem".
    ------------------------------------------------------------------ */
    formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    },

    /* ------------------------------------------------------------------
       SELO DE STATUS
       Retorna o HTML de um selo (badge) colorido de acordo com o
       status. A lista SELOS mostra qual classe usar para cada status.
    ------------------------------------------------------------------ */
    selo(status) {
        const selos = {
            /* status da agenda e procedimentos */
            'confirmada':     ['selo-info',    'ri-checkbox-circle-line', 'Confirmada'],
            'em-andamento':   ['selo-aviso',   'ri-time-line',            'Em andamento'],
            'concluida':      ['selo-sucesso', 'ri-checkbox-circle-fill', 'Concluída'],
            'cancelada':      ['selo-erro',    'ri-close-circle-line',    'Cancelada'],

            /* status genéricos de processo */
            'concluido':      ['selo-sucesso', 'ri-checkbox-circle-fill', 'Concluído'],
            'pendente':       ['selo-aviso',   'ri-time-line',            'Pendente'],

            /* status de paciente */
            'ativo':          ['selo-sucesso', 'ri-checkbox-circle-line', 'Ativo'],
            'inativo':        ['selo-neutro',  'ri-pause-circle-line',    'Inativo'],

            /* status de pagamento */
            'pago':           ['selo-sucesso', 'ri-checkbox-circle-line', 'Pago'],
            'atrasado':       ['selo-erro',    'ri-alert-line',           'Atrasado'],
        };

        /* Se o status não estiver na lista, usa cinza com interrogação */
        const [classe, icone, texto] = selos[status] || ['selo-neutro', 'ri-question-line', status];

        return `<span class="selo ${classe}"><i class="${icone}"></i>${texto}</span>`;
    },

    /* ------------------------------------------------------------------
       TOAST (notificação do canto da tela)
       Ex: AJUDA.toast("Paciente salvo!", "sucesso")
       Tipos: sucesso | aviso | erro | (padrão = info)
    ------------------------------------------------------------------ */
    toast(mensagem, tipo = 'info') {
        const icones = {
            sucesso: 'ri-checkbox-circle-fill',
            aviso:   'ri-alert-fill',
            erro:    'ri-error-warning-fill',
            info:    'ri-information-fill',
        };

        /* Cria o "palco" das notificações na primeira vez que for usado */
        let pilha = document.querySelector('.toast-pilha');
        if (!pilha) {
            pilha = document.createElement('div');
            pilha.className = 'toast-pilha';
            document.body.appendChild(pilha);
        }

        /* Monta o aviso e adiciona na tela */
        const aviso = document.createElement('div');
        aviso.className = `toast toast-${tipo}`;
        aviso.innerHTML = `
            <i class="${icones[tipo] || icones.info}"></i>
            <div><strong>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</strong><p>${mensagem}</p></div>
        `;
        pilha.appendChild(aviso);

        /* Depois de 4.5 segundos, o aviso some com uma animação */
        setTimeout(() => {
            aviso.classList.add('saindo');   // ativa a animação de saída
            setTimeout(() => aviso.remove(), 260); // e então é apagado
        }, 4500);
    },

    /* ------------------------------------------------------------------
       MODAL (janela de cadastro)
       abrirModal("modalNovoPaciente")  → mostra a janela
       fecharModal("modalNovoPaciente") → esconde a janela
    ------------------------------------------------------------------ */
    abrirModal(id) {
        document.getElementById(id).classList.add('aberto');
    },

    fecharModal(id) {
        document.getElementById(id).classList.remove('aberto');
    },

    /* ------------------------------------------------------------------
       ABAS (troca de conteúdo)
       Recebe o botão clicado e mostra o painel correspondente.
       O nome do painel fica no atributo data-alvo do botão.
    ------------------------------------------------------------------ */
    trocarAba(botao) {
        /* Tira a marca de ativo de todas as abas e painéis */
        document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
        document.querySelectorAll('.painel').forEach(p => p.classList.remove('ativo'));

        /* Ativa a aba clicada e o painel que ela aponta */
        botao.classList.add('ativa');
        document.getElementById(botao.dataset.alvo).classList.add('ativo');
    },

    /* ------------------------------------------------------------------
       ÍCONE DE PROCEDIMENTO
       Cada tipo de procedimento tem um ícone diferente (remix icon).
    ------------------------------------------------------------------ */
    iconeProcedimento(tipo) {
        const icones = {
            'Limpeza':    'ri-sparkling-2-line',
            'Canal':      'ri-syringe-line',
            'Extração':   'ri-scissors-cut-line',
            'Ortodontia': 'ri-magic-line',
            'Implante':   'ri-tools-line',
        };
        return icones[tipo] || 'ri-tooth-line';
    },
};