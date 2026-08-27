/* =====================================================================
   PROCEDIMENTOS.JS — Página de procedimentos clínicos
   ---------------------------------------------------------------------
   Mostra o resumo financeiro (receita x custo), a tabela de
   procedimentos com filtro por tipo e o cadastro de novos.
   ===================================================================== */

/* ------------------------------------------------------------------
   FUNÇÃO QUE MONTA O CARTÃO DE ESTATÍSTICA (mesma do dashboard)
------------------------------------------------------------------ */
function cartaoStat(icone, classeCor, valor, rotulo) {
    return `
        <div class="cartao cartao-flutuante stat-card">
            <div class="stat-icone ${classeCor}"><i class="${icone}"></i></div>
            <div>
                <div class="stat-valor">${valor}</div>
                <div class="stat-rotulo">${rotulo}</div>
            </div>
        </div>`;
}

/* ------------------------------------------------------------------
   MONTAR A PÁGINA INTEIRA
   São 3 partes:
   1) Quatro cartões de resumo
   2) Linha com filtro de tipo + botão "Novo procedimento"
   3) Tabela com os procedimentos (montada conforme o filtro)
------------------------------------------------------------------ */
function montarPagina() {
    const procs = DADOS.procedimentos;

    /* Resumo para os cartões do topo */
    const total      = procs.length;
    const concluidos = procs.filter(p => p.status === 'concluido').length;
    const receita    = procs.filter(p => p.status === 'concluido').reduce((s, p) => s + p.valor, 0);
    const custo      = 8.6;   // % médio que a clínica estima como custo fixo

    /* Tipos de procedimento que já aparecem em algum lugar da base */
    const tipos = [...new Set(procs.map(p => p.tipo))];

    /* Lista os pacientes para o select do modal de novo procedimento */
    document.getElementById('fProcPaciente').innerHTML =
        DADOS.pacientes.map(p => `<option>${p.nome}</option>`).join('');

    document.getElementById('conteudoProcedimentos').innerHTML = `
        <!-- 1) Resumo financeiro -->
        <div class="grade-stat">
            ${cartaoStat('ri-file-list-3-line', 'icone-primario', total, 'Procedimentos')}
            ${cartaoStat('ri-check-double-line', 'icone-sucesso', concluidos, 'Concluídos')}
            ${cartaoStat('ri-money-dollar-circle-line', 'icone-aviso', AJUDA.formatarMoeda(receita), 'Receita bruta')}
            ${cartaoStat('ri-pie-chart-2-line', 'icone-info', `${custo}%`, 'Custo estimado')}
        </div>

        <!-- 2 + 3) Painel principal -->
        <div class="cartao painel-procedimentos">
            <div class="barra-tabela">
                <div class="filtro-grupo">
                    <button class="filtro-chip ativo" data-tipo="todos"><i class="ri-list-check-2"></i> Todos</button>
                    ${tipos.map(t => `<button class="filtro-chip" data-tipo="${t}"><i class="${AJUDA.iconeProcedimento(t)}"></i> ${t}</button>`).join('')}
                </div>
                <button class="btn btn-acento" id="btnNovoProcedimento"><i class="ri-add-line"></i> Novo procedimento</button>
            </div>

            <div class="tabela-enrole">
                <table class="lista">
                    <thead>
                        <tr><th>Data</th><th>Paciente</th><th>Procedimento</th><th>Dentista</th><th>Valor</th><th>Status</th></tr>
                    </thead>
                    <tbody id="corpoProcedimentos"></tbody>
                </table>
            </div>
        </div>`;

    /* Liga os filtros de tipo (recém-criados) e desenha a tabela */
    document.querySelectorAll('.filtro-chip').forEach(chip =>
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filtro-chip').forEach(c => c.classList.remove('ativo'));
            chip.classList.add('ativo');
            montarTabela();
        })
    );

    montarTabela();
}

/* ------------------------------------------------------------------
   MONTAR SÓ A TABELA (respeita o filtro de tipo ativo)
------------------------------------------------------------------ */
function montarTabela() {
    const tipo = document.querySelector('.filtro-chip.ativo').dataset.tipo;
    const lista = modeloStatusTabela(tipo);

    document.getElementById('corpoProcedimentos').innerHTML = lista.map(p => `
        <tr>
            <td>${AJUDA.formatarData(p.data)}</td>
            <td>${p.paciente}</td>
            <td><span class="flex flex-centro gap-sm"><i class="${AJUDA.iconeProcedimento(p.tipo)}"></i> ${p.tipo}</span></td>
            <td>${p.dentista}</td>
            <td><strong>${AJUDA.formatarMoeda(p.valor)}</strong></td>
            <td>${AJUDA.selo(p.status)}</td>
        </tr>`).join('');

    /* Anima as linhas quando a lista muda */
    if (typeof gsap !== 'undefined') {
        gsap.from('#corpoProcedimentos tr', { opacity: 0, y: 6, stagger: 0.03, duration: 0.25, ease: 'power2.out' });
    }
}

/* ------------------------------------------------------------------
   FILTRA A LISTA PELO TIPO ESCOLHIDO
   (separado só para deixar a regra clara)
------------------------------------------------------------------ */
function modeloStatusTabela(tipo) {
    if (tipo === 'todos') return DADOS.procedimentos;
    return DADOS.procedimentos.filter(p => p.tipo === tipo);
}

/* ------------------------------------------------------------------
   SALVAR NOVO PROCEDIMENTO
------------------------------------------------------------------ */
function salvarNovoProcedimento() {
    const form = document.getElementById('formNovoProcedimento');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const novo = {
        id: DADOS.procedimentos.length + 1,
        paciente: document.getElementById('fProcPaciente').value,
        tipo: document.getElementById('fProcTipo').value,
        valor: Number(document.getElementById('fProcValor').value),
        dentista: usuarioLogado().nome,      // quem registrou (usuário logado)
        data: new Date().toISOString().slice(0, 10),  // hoje
        status: 'em-andamento',              // começa "em andamento"
    };

    DADOS.procedimentos.unshift(novo);

    AJUDA.fecharModal('modalNovoProcedimento');
    AJUDA.toast('Procedimento registrado com sucesso!', 'sucesso');
    form.reset();

    /* Re-monta a página para os cartões de resumo atualizarem */
    montarPagina();
}

/* ------------------------------------------------------------------
   INÍCIO DA PÁGINA
------------------------------------------------------------------ */
function iniciarProcedimentos() {
    montarPagina();

    /* Abre/fecha o modal */
    document.getElementById('btnNovoProcedimento').addEventListener('click',
        () => AJUDA.abrirModal('modalNovoProcedimento'));
    document.querySelectorAll('[data-fechar-modal]').forEach(b =>
        b.addEventListener('click', () => AJUDA.fecharModal('modalNovoProcedimento')));

    document.getElementById('btnSalvarProcedimento').addEventListener('click', salvarNovoProcedimento);

    document.getElementById('modalNovoProcedimento').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) AJUDA.fecharModal('modalNovoProcedimento');
    });
}

document.addEventListener('DOMContentLoaded', iniciarProcedimentos);