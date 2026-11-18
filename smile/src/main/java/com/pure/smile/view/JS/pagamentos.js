/* =====================================================================
   PAGAMENTOS.JS — Página de financeiro / contas a receber
   ---------------------------------------------------------------------
   Mostra 4 cartões de resumo, gráfico de receita (últimos dias),
   distribuição por método de pagamento e uma tabela filtrável
   por status (Pago / Pendente / Atrasado).
   ===================================================================== */

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
   MONTAR PÁGINA INTEIRA
------------------------------------------------------------------ */
function montarPagina() {
    const pagamentos = DADOS.pagamentos;

    /* Somatórias por status */
    const total     = pagamentos.length;
    const somaPago  = pagamentos.filter(p => p.status === 'pago').reduce((s, p) => s + p.valor, 0);
    const somaPend  = pagamentos.filter(p => p.status === 'pendente' || p.status === 'atrasado').reduce((s, p) => s + p.valor, 0);

    document.getElementById('conteudoPagamentos').innerHTML = `
        <!-- 1) Cartões de resumo -->
        <div class="grade-stat">
            ${cartaoStat('ri-bank-card-line', 'icone-primario', total, 'Recebimentos registrados')}
            ${cartaoStat('ri-checkbox-circle-line', 'icone-sucesso', AJUDA.formatarMoeda(somaPago), 'Total recebido')}
            ${cartaoStat('ri-time-line', 'icone-aviso', AJUDA.formatarMoeda(somaPend), 'A receber')}
            ${cartaoStat('ri-percent-line', 'icone-info', '100%', 'Taxa de recebimento')}
        </div>

        <!-- 2) Gráfico + métodos -->
        <div class="pagamentos-colunas">
            <div class="cartao cartao-corpo">
                <div class="cartao-titulo"><h3>Receita — últimos 7 dias</h3></div>
                <div class="grafico-barras" id="graficoReceita" style="height:200px;"></div>
            </div>

            <div class="cartao cartao-corpo">
                <div class="cartao-titulo"><h3>Métodos de pagamento</h3></div>
                <div id="listaMetodos"></div>
            </div>
        </div>

        <!-- 3) Tabela de pagamentos -->
        <div class="cartao painel-pagamentos">
            <div class="barra-tabela">
                <div class="filtro-grupo">
                    <button class="filtro-chip ativo" data-status="todos"><i class="ri-list-check-2"></i> Todos</button>
                    <button class="filtro-chip" data-status="pago"><i class="ri-checkbox-circle-line"></i> Pagos</button>
                    <button class="filtro-chip" data-status="pendente"><i class="ri-time-line"></i> Pendentes</button>
                    <button class="filtro-chip" data-status="atrasado"><i class="ri-alert-line"></i> Atrasados</button>
                </div>
                <button class="btn btn-acento" id="btnRegistrarPagamento"><i class="ri-add-line"></i> Registrar pagamento</button>
            </div>

            <div class="tabela-enrole">
                <table class="lista">
                    <thead>
                        <tr><th>Data</th><th>Paciente</th><th>Método</th><th>Valor</th><th>Status</th><th>Ações</th></tr>
                    </thead>
                    <tbody id="corpoPagamentos"></tbody>
                </table>
            </div>
        </div>`;

    /* Preenche o gráfico e a lista de métodos */
    montarGrafico();
    montarMetodos();

    /* Liga os filtros de status */
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
   GRÁFICO de receita (7 colunas de barras)
------------------------------------------------------------------ */
function montarGrafico() {
    const valores = DADOS.receitaMes;
    const maior   = Math.max(...valores);

    document.getElementById('graficoReceita').innerHTML = valores.map((v, i) => `
        <div class="barra-col">
            <div class="barra" style="height:${(v / maior) * 100}%" title="${AJUDA.formatarMoeda(v)}"></div>
            <div class="barra-rotulo">Dia ${i + 2}</div>
        </div>`).join('');
}

/* ------------------------------------------------------------------
   LISTA DE MÉTODOS DE PAGAMENTO (percentual de uso por método)
------------------------------------------------------------------ */
function montarMetodos() {
    /* Conta quanto cada método movimentou */
    const totalPorMetodo = {};
    DADOS.pagamentos.forEach(p => {
        totalPorMetodo[p.metodo] = (totalPorMetodo[p.metodo] || 0) + p.valor;
    });

    const somaTudo = Object.values(totalPorMetodo).reduce((s, v) => s + v, 0); // receita total

    document.getElementById('listaMetodos').innerHTML =
        Object.entries(totalPorMetodo).map(([metodo, valor]) => `
            <div style="margin-bottom:var(--esp-md);">
                <div class="flex espaco-entre">
                    <strong class="texto-pequeno">${metodo}</strong>
                    <span class="texto-pequeno texto-apagado">${AJUDA.formatarMoeda(valor)}</span>
                </div>
                <div class="metodo-bar">
                    <span style="width:${(valor / somaTudo) * 100}%"></span>
                </div>
            </div>`).join('');
}

/* ------------------------------------------------------------------
   TABELA de pagamentos (respeita o filtro de status)
------------------------------------------------------------------ */
function montarTabela() {
    const status = document.querySelector('.filtro-chip.ativo').dataset.status;
    const lista = status === 'todos'
        ? DADOS.pagamentos
        : DADOS.pagamentos.filter(p => p.status === status);

    document.getElementById('corpoPagamentos').innerHTML = lista.map(p => `
        <tr>
            <td>${AJUDA.formatarData(p.data)}</td>
            <td>${p.paciente}</td>
            <td>${p.metodo}</td>
            <td><strong>${AJUDA.formatarMoeda(p.valor)}</strong></td>
            <td>${AJUDA.selo(p.status)}</td>
            <td>
                <button class="btn btn-fantasma btn-pequeno" title="Confirmar recebimento"
                        onclick="quitarPagamento(${p.id})">
                    <i class="ri-check-double-line"></i> Quitar
                </button>
            </td>
        </tr>`).join('');

    if (typeof gsap !== 'undefined') {
        gsap.from('#corpoPagamentos tr', { opacity: 0, y: 6, stagger: 0.03, duration: 0.25, ease: 'power2.out' });
    }
}

/* ------------------------------------------------------------------
   QUITAR PAGAMENTO (transforma pendente/atrasado em "pago")
------------------------------------------------------------------ */
function quitarPagamento(id) {
    const pg = DADOS.pagamentos.find(p => p.id === id);
    if (!pg) return;

    pg.status = 'pago';
    AJUDA.toast(`Pagamento de ${AJUDA.formatarMoeda(pg.valor)} quitado com sucesso!`, 'sucesso');
    montarPagina();   // re-monta tudo para os números atualizarem
}

/* ------------------------------------------------------------------
   SALVAR NOVO PAGAMENTO
------------------------------------------------------------------ */
function salvarNovoPagamento() {
    const form = document.getElementById('formPagamento');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const novo = {
        id: DADOS.pagamentos.length + 1,
        paciente: document.getElementById('fPagPaciente').value,
        valor: Number(document.getElementById('fPagValor').value),
        metodo: document.getElementById('fPagMetodo').value,
        data: new Date().toISOString().slice(0, 10),
        status: 'pago',   // ao registrar confirmamos o recebimento
    };

    DADOS.pagamentos.unshift(novo);

    AJUDA.fecharModal('modalRegistrarPagamento');
    AJUDA.toast('Recebimento registrado com sucesso!', 'sucesso');
    form.reset();
    montarPagina();
}

/* ------------------------------------------------------------------
   INÍCIO DA PÁGINA
------------------------------------------------------------------ */
function iniciarPagamentos() {
    montarPagina();

    /* Preenche o select de pacientes do modal */
    document.getElementById('fPagPaciente').innerHTML =
        DADOS.pacientes.map(p => `<option>${p.nome}</option>`).join('');

    document.getElementById('btnRegistrarPagamento').addEventListener('click',
        () => AJUDA.abrirModal('modalRegistrarPagamento'));
    document.querySelectorAll('[data-fechar-modal]').forEach(b =>
        b.addEventListener('click', () => AJUDA.fecharModal('modalRegistrarPagamento')));

    document.getElementById('btnSalvarPagamento').addEventListener('click', salvarNovoPagamento);

    document.getElementById('modalRegistrarPagamento').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) AJUDA.fecharModal('modalRegistrarPagamento');
    });
}

document.addEventListener('DOMContentLoaded', iniciarPagamentos);