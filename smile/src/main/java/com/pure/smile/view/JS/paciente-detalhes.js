/* =====================================================================
   PACIENTE-DETALHES.JS — Página de detalhes de um paciente
   ---------------------------------------------------------------------
   A página recebe o id do paciente pela URL: paciente-detalhes.html?id=2
   Então carrega esse paciente e monta:
   - Cabeçalho com foto e dados principais
   - Resumo de consultas
   - Abas: Dados / Consultas / Procedimentos / Financeiro
   ===================================================================== */

/* ------------------------------------------------------------------
   PEGA O ID DA URL
   Lê a parte "?id=2" do endereço e devolve o número.
   Se não tiver, usa o primeiro paciente da lista (id 1).
------------------------------------------------------------------ */
function pegarIdDaUrl() {
    const url = new URLSearchParams(window.location.search);
    return Number(url.get('id')) || 1;
}

/* ------------------------------------------------------------------
   ENCONTRA UM PACIENTE PELO ID (na lista DADOS.pacientes)
------------------------------------------------------------------ */
function encontrarPaciente(id) {
    return DADOS.pacientes.find(p => p.id === id);
}

/* ------------------------------------------------------------------
   DADOS RELACIONADOS AO PACIENTE
   Filtra as listas de dados para trazer só o que é deste paciente.
------------------------------------------------------------------ */
function dadosDoPaciente(nome) {
    return {
        consultas:     DADOS.consultas.filter(c => c.paciente === nome),
        procedimentos: DADOS.procedimentos.filter(p => p.paciente === nome),
        pagamentos:    DADOS.pagamentos.filter(p => p.paciente === nome),
    };
}

/* ------------------------------------------------------------------
   FUNÇÃO QUE MONTA O CABEÇALHO (foto + nome + badges + ações)
------------------------------------------------------------------ */
function cabecalhoPerfil(p) {
    return `
        <div class="cartao cartao-corpo perfil-perfil margem-baixo-lg">
            <img src="${p.avatar}" alt="${p.nome}">
            <div class="meio">
                <h3>${p.nome}</h3>
                <div class="flex flex-centro gap-sm margem-topo-md">
                    ${AJUDA.selo(p.status)}
                    <span class="selo selo-neutro"><i class="ri-hashtag"></i>Paciente #${String(p.id).padStart(3, '0')}</span>
                </div>
            </div>
            <!-- Botões de ação do paciente -->
            <div class="flex flex-centro gap-sm">
                <button class="btn btn-fantasma" onclick="AJUDA.toast('Agenda do paciente em breve na tela da Agenda.')">
                    <i class="ri-calendar-event-line"></i> Agendar
                </button>
                <button class="btn btn-primario" onclick="AJUDA.toast('Edição de paciente em desenvolvimento na versão 2.0.')">
                    <i class="ri-pencil-line"></i> Editar
                </button>
            </div>
        </div>`;
}

/* ------------------------------------------------------------------
   Bloco informativo com os dados pessoais do paciente
------------------------------------------------------------------ */
function blocoDadosPessoais(p) {
    return `
        <div class="cartao cartao-corpo">
            <div class="cartao-titulo"><h3><i class="ri-user-3-line"></i> Dados pessoais</h3></div>

            <div class="item-dado"><label>Nascimento</label><strong>${AJUDA.formatarData(p.nascimento)}</strong></div>
            <div class="item-dado"><label>CPF</label><strong>${p.cpf}</strong></div>
            <div class="item-dado"><label>Telefone</label><strong>${p.telefone}</strong></div>
            <div class="item-dado"><label>E-mail</label><strong>${p.email}</strong></div>
            <div class="item-dado"><label>Convênio</label><strong>${p.convenio}</strong></div>
            <div class="item-dado"><label>Última visita</label><strong>${AJUDA.formatarData(p.ultimaVisita)}</strong></div>

            <hr class="divisoria">

            <!-- Mini resumo de consultas por status -->
            <label class="texto-apagado texto-pequeno" style="font-weight:600;">Consultas por status:</label>
            <div class="resumo-status margem-topo-md">
                ${AJUDA.selo('concluida')}
                ${AJUDA.selo('confirmada')}
                ${AJUDA.selo('pendente')}
            </div>
        </div>`;
}

/* ------------------------------------------------------------------
   Bloco de resumo (triagem de alertas) — à direita do Dados pessoais
------------------------------------------------------------------ */
function blocoResumo(nome) {
    const { consultas } = dadosDoPaciente(nome);
    const total = consultas.length;
    const concluida  = consultas.filter(c => c.status === 'concluida').length;
    const confirmada = consultas.filter(c => c.status === 'confirmada').length;
    const pendente   = consultas.filter(c => c.status === 'pendente').length;

    return `
        <div class="cartao cartao-corpo">
            <div class="cartao-titulo"><h3><i class="ri-pulse-line"></i> Resumo clínico</h3></div>
            <div class="grade-stat" style="margin-bottom:var(--esp-md);">
                ${cartaoStat('ri-checkbox-circle-line', 'icone-sucesso', concluida, 'Concluídas')}
                ${cartaoStat('ri-calendar-check-line', 'icone-info', confirmada, 'Agendadas')}
                ${cartaoStat('ri-time-line', 'icone-aviso', pendente, 'Pendentes')}
                ${cartaoStat('ri-file-list-3-line', 'icone-primario', total, 'Total')}
            </div>

            <div class="aviso aviso-info">
                <i class="ri-information-line"></i>
                <div>
                    <strong>Anotações</strong>
                    <p class="texto-pequeno">Sem alergias cadastradas. Recomenda-se revisar o histórico antes de novos procedimentos.</p>
                </div>
            </div>
        </div>`;
}

/* ------------------------------------------------------------------
   Função auxiliar: cartão de estatística (igual à usada no dashboard)
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
   ABAS: quatro conteúdos possíveis, trocados ao clicar
   Cada aba chama AJUDA.trocarAba(), que se encarrega do resto.
------------------------------------------------------------------ */
function blocoAbas(p) {
    const { consultas, procedimentos, pagamentos } = dadosDoPaciente(p.nome);

    return `
        <div class="cartao cartao-corpo">
            <!-- Botões das abas -->
            <div class="abas">
                <button class="aba ativa" data-alvo="abaDados">Dados</button>
                <button class="aba" data-alvo="abaConsultas">Consultas</button>
                <button class="aba" data-alvo="abaProcedimentos">Procedimentos</button>
                <button class="aba" data-alvo="abaFinanceiro">Financeiro</button>
            </div>

            <!-- CONTEÚDO: aba Dados -->
            <div class="painel ativo" id="abaDados">
                <div class="grade-info">
                    ${blocoDadosPessoais(p)}
                    ${blocoResumo(p.nome)}
                </div>
            </div>

            <!-- CONTEÚDO: aba Consultas -->
            <div class="painel" id="abaConsultas">
                <div class="tabela-enrole">
                    <table class="lista">
                        <thead><tr><th>Dia</th><th>Horário</th><th>Procedimento</th><th>Dentista</th><th>Status</th></tr></thead>
                        <tbody>
                            ${consultas.map(c => `
                                <tr>
                                    <td>${c.dia}</td>
                                    <td>${c.horario}</td>
                                    <td>${c.procedimento}</td>
                                    <td>${c.dentista}</td>
                                    <td>${AJUDA.selo(c.status)}</td>
                                </tr>`).join('') || `<tr><td colspan="5"><p class="texto-apagado">Nenhuma consulta registrada.</p></td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- CONTEÚDO: aba Procedimentos -->
            <div class="painel" id="abaProcedimentos">
                <div class="tabela-enrole">
                    <table class="lista">
                        <thead><tr><th>Data</th><th>Descrição</th><th>Duração</th><th>Status</th></tr></thead>
                        <tbody>
                            ${procedimentos.map(pr => `
                                <tr>
                                    <td>${AJUDA.formatarData(pr.data)}</td>
                                    <td>${pr.descricao}</td>
                                    <td>${pr.duracao}</td>
                                    <td>${AJUDA.selo(pr.status)}</td>
                                </tr>`).join('') || `<tr><td colspan="4"><p class="texto-apagado">Nenhum procedimento registrado.</p></td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- CONTEÚDO: aba Financeiro -->
            <div class="painel" id="abaFinanceiro">
                <div class="tabela-enrole">
                    <table class="lista">
                        <thead><tr><th>Data</th><th>Descrição</th><th>Método</th><th>Valor</th><th>Status</th></tr></thead>
                        <tbody>
                            ${pagamentos.map(pg => `
                                <tr>
                                    <td>${AJUDA.formatarData(pg.data)}</td>
                                    <td>${pg.descricao}</td>
                                    <td>${pg.metodo}</td>
                                    <td>${AJUDA.formatarMoeda(pg.valor)}</td>
                                    <td>${AJUDA.selo(pg.status)}</td>
                                </tr>`).join('') || `<tr><td colspan="5"><p class="texto-apagado">Nenhum pagamento registrado.</p></td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

/* ------------------------------------------------------------------
   INÍCIO: monta todas as peças da página
------------------------------------------------------------------ */
function iniciarPacienteDetalhes() {
    const paciente = encontrarPaciente(pegarIdDaUrl());

    /* Se o id não existir, mostra um aviso amigável */
    if (!paciente) {
        document.getElementById('conteudoDetalhes').innerHTML = `
            <div class="cartao cartao-corpo vazio">
                <i class="ri-user-unfollow-line"></i>
                <h4>Paciente não encontrado</h4>
                <p>Verifique o endereço ou volte para a lista de pacientes.</p>
                <button class="btn btn-primario" onclick="location.href='pacientes.html'">Voltar para pacientes</button>
            </div>`;
        return;
    }

    /* Personaliza o título da topbar: mostra o nome do paciente */
    PSLayout.trocarTitulo(paciente.nome, 'Ficha completa do paciente');

    /* Combina todas as partes na página */
    document.getElementById('conteudoDetalhes').innerHTML =
        cabecalhoPerfil(paciente) + blocoAbas(paciente);

    /* Liga os cliques das abas */
    document.querySelectorAll('.aba').forEach(aba =>
        aba.addEventListener('click', () => AJUDA.trocarAba(aba))
    );

    /* Anima suavemente os cartões ao abrir */
    if (typeof gsap !== 'undefined') {
        gsap.from('.perfil-perfil, .cartao', { opacity: 0, y: 14, stagger: 0.06, duration: 0.45, ease: 'power2.out' });
    }
}

document.addEventListener('DOMContentLoaded', iniciarPacienteDetalhes);