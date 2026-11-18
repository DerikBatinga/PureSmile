/* =====================================================================
   DASHBOARD.JS — Lógica da página inicial do Pure Smile
   ---------------------------------------------------------------------
   O dashboard mostrado muda conforme o PERFIL logado:
   - Dentista, Secretaria e Administrador  → visão da clínica
   - Paciente                              → visão pessoal dele

   A leitura do perfil é feita em layout.js (função PSLayout.getRole()).
   Aqui usamos localStorage e a lista DADOS do arquivo dados.js.
   ===================================================================== */

/* ------------------------------------------------------------------
   FUNÇÃO QUE MONTA UM CARTÃO DE ESTATÍSTICA (número + ícone)
   É chamada para montar os 4 cartões do topo.
   Parâmetros: ícone, classe da cor, valor, rótulo
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
   BLOCO "PRÓXIMAS CONSULTAS"
   Recebe uma lista de consultas e monta as linhas da agenda.
   Se a lista estiver vazia mostra o estado vazio.
------------------------------------------------------------------ */
function blocoConsultas(lista) {
    /* Se não tem consulta, mostra mensagem amigável em vez de lista vazia */
    if (!lista.length) {
        return `
            <div class="cartao cartao-corpo">
                <div class="cartao-titulo"><h3>Próximas consultas</h3></div>
                <div class="vazio">
                    <i class="ri-calendar-event-line"></i>
                    <h4>Nenhuma consulta agendada</h4>
                    <p>Quando novas consultas forem marcadas, elas aparecem aqui.</p>
                </div>
            </div>`;
    }

    return `
        <div class="cartao cartao-corpo">
            <div class="cartao-titulo">
                <h3>Próximas consultas</h3>
                <a href="agenda.html" class="btn btn-fantasma btn-pequeno">Ver agenda</a>
            </div>
            ${lista.map(c => `
                <div class="linha-lista">
                    <img src="https://i.pravatar.cc/100?u=${encodeURIComponent(c.paciente)}" alt="">
                    <div class="meta">
                        <strong>${c.paciente}</strong>
                        <span>${c.procedimento} · ${c.dentista}</span>
                    </div>
                    <span class="direita">${c.horario}</span>
                </div>`).join('')}
        </div>`;
}

/* ------------------------------------------------------------------
   BLOCO "ATIVIDADES RECENTES"
   Mostra o que aconteceu na clínica nas últimas horas.
------------------------------------------------------------------ */
function blocoAtividades() {
    return `
        <div class="cartao cartao-corpo">
            <div class="cartao-titulo"><h3>Atividades recentes</h3></div>
            ${DADOS.atividades.map(a => `
                <div class="linha-lista">
                    <div class="icone-atividade"><i class="${a.icone}"></i></div>
                    <div class="meta">
                        <span>${a.texto}</span>
                        <span>${a.tempo}</span>
                    </div>
                </div>`).join('')}
        </div>`;
}

/* ------------------------------------------------------------------
   BLOCO "AÇÕES RÁPIDAS"
   Botões que levam às outras páginas do sistema.
------------------------------------------------------------------ */
function blocoAcoesRapidas() {
    return `
        <div class="cartao cartao-corpo">
            <div class="cartao-titulo"><h3>Ações rápidas</h3></div>
            <div class="acoes-rapidas">
                <div class="acao-rapida" onclick="location.href='pacientes.html'">
                    <i class="ri-user-add-line"></i><span>Novo Paciente</span>
                </div>
                <div class="acao-rapida" onclick="AJUDA.toast('Cadastro de dentista disponível no módulo Configurações.')">
                    <i class="ri-stethoscope-line"></i><span>Novo Dentista</span>
                </div>
                <div class="acao-rapida" onclick="location.href='agenda.html'">
                    <i class="ri-calendar-event-line"></i><span>Nova Consulta</span>
                </div>
                <div class="acao-rapida" onclick="location.href='procedimentos.html'">
                    <i class="ri-tooth-line"></i><span>Novo Procedimento</span>
                </div>
            </div>
        </div>`;
}

/* ------------------------------------------------------------------
   DASHBOARD DOS FUNCIONÁRIOS (dentista, secretaria, admin)
   Mostra números da clínica inteira.
------------------------------------------------------------------ */
function montarDashboardClínica() {
    /* Contas que alimentam os cartões do topo */
    const pacientesAtivos = DADOS.pacientes.filter(p => p.status === 'ativo').length;
    const consultasHoje   = DADOS.consultas.filter(c => c.dia === 1);          // dia 1 = segunda-feira
    const dentistasAtivos = DADOS.dentistas.filter(d => d.status === 'ativo').length;
    const receitaDoMes    = DADOS.receitaMes.reduce((soma, v) => soma + v, 0);  // soma tudo

    document.getElementById('conteudoDash').innerHTML = `
        <!-- 4 cartões de número no topo -->
        <div class="grade-stat dash-stats">
            ${cartaoStat('ri-group-line', 'icone-primario', pacientesAtivos, 'Pacientes ativos')}
            ${cartaoStat('ri-calendar-check-line', 'icone-info', consultasHoje.length, 'Consultas hoje')}
            ${cartaoStat('ri-stethoscope-line', 'icone-sucesso', dentistasAtivos, 'Dentistas ativos')}
            ${cartaoStat('ri-money-dollar-circle-line', 'icone-aviso', AJUDA.formatarMoeda(receitaDoMes), 'Receita mensal')}
        </div>

        <!-- Duas colunas: esquerda (números da semana) e direita (ações) -->
        <div class="dash-colunas">
            <div class="dash-pilha">

                <!-- Gráfico de atendimentos da semana -->
                <div class="cartao cartao-corpo">
                    <div class="cartao-titulo"><h3>Visão semanal de atendimentos</h3></div>
                    <div class="grafico-barras" id="graficoVisitas"></div>
                </div>

                <!-- Gráfico de receita -->
                <div class="cartao cartao-corpo">
                    <div class="cartao-titulo"><h3>Receita — últimos 7 dias</h3></div>
                    <div class="grafico-barras" id="graficoReceita"></div>
                </div>

                <!-- Próximas consultas -->
                ${blocoConsultas(consultasHoje)}
            </div>

            <div class="dash-pilha">
                ${blocoAcoesRapidas()}
                ${blocoAtividades()}
            </div>
        </div>`;

    /* Preenche os dois gráficos de barras usando os dados da semana */
    montarGrafico('graficoVisitas', DADOS.visitasSemana, ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], '');
    montarGrafico('graficoReceita', DADOS.receitaMes, ['24/07', '25/07', '26/07', '27/07', '28/07', '29/07', '30/07'], 'R$ ');
}

/* ------------------------------------------------------------------
   DASHBOARD DO PACIENTE
   Mostra os dados PESSOAIS do paciente logado na demonstração.
------------------------------------------------------------------ */
function montarDashboardPaciente() {
    const eu = pacienteLogado();   // quem é o paciente logado (função do dados.js)

    /* Filtra só o que é do paciente */
    const minhasConsultas   = DADOS.consultas.filter(c => c.paciente === eu.nome);
    const meusProcedimentos = DADOS.procedimentos.filter(p => p.paciente === eu.nome);
    const meusPagamentos    = DADOS.pagamentos.filter(p => p.paciente === eu.nome);
    const proximaConsulta   = minhasConsultas[0];                    // primeira da lista
    const pendenciaFinan    = meusPagamentos.find(p => p.status !== 'pago');

    document.getElementById('conteudoDash').innerHTML = `
        <!-- Cartão de boas-vindas -->
        <div class="cartao cartao-corpo boas-vindas">
            <div class="flex flex-centro gap-md">
                <img class="avatar" src="${eu.avatar}" alt="${eu.nome}">
                <div>
                    <h2>Olá, ${eu.nome.split(' ')[0]}!</h2>
                    <p class="texto-apagado texto-pequeno">Bem-vinda de volta ao seu espaço Pure Smile.</p>
                </div>
            </div>
        </div>

        <!-- 4 cartões de número (pessoais) -->
        <div class="grade-stat dash-stats">
            ${cartaoStat('ri-calendar-event-line', 'icone-primario', proximaConsulta ? proximaConsulta.horario : '—',
                         proximaConsulta ? `Próxima consulta (${proximaConsulta.procedimento})` : 'Sem consultas')}
            ${cartaoStat('ri-tooth-line', 'icone-info', meusProcedimentos.length, 'Procedimentos realizados')}
            ${cartaoStat('ri-file-list-3-line', 'icone-aviso',
                         pendenciaFinan ? AJUDA.formatarMoeda(pendenciaFinan.valor) : AJUDA.formatarMoeda(0),
                         'Pendência financeira')}
            ${cartaoStat('ri-shield-check-line', 'icone-sucesso', 'Em dia', 'Situação cadastral')}
        </div>

        <div class="dash-colunas">
            <div class="dash-pilha">
                ${blocoConsultas(minhasConsultas)}

                <!-- Meus procedimentos mais recentes -->
                <div class="cartao cartao-corpo">
                    <div class="cartao-titulo">
                        <h3>Meus procedimentos recentes</h3>
                        <a href="procedimentos.html" class="btn btn-fantasma btn-pequeno">Ver todos</a>
                    </div>
                    ${meusProcedimentos.map(p => `
                        <div class="linha-lista">
                            <div class="stat-icone icone-info" style="width:36px;height:36px;font-size:16px;">
                                <i class="ri-tooth-line"></i>
                            </div>
                            <div class="meta">
                                <strong>${p.tipo}</strong>
                                <span>${p.dentista} · ${AJUDA.formatarData(p.data)}</span>
                            </div>
                            ${AJUDA.selo(p.status)}
                        </div>`).join('') || '<p class="texto-apagado texto-pequeno">Nenhum procedimento registrado ainda.</p>'}
                </div>
            </div>

            <div class="dash-pilha">
                <!-- Informações da clínica -->
                <div class="cartao cartao-corpo">
                    <div class="cartao-titulo"><h3>Informações da clínica</h3></div>
                    <div class="linha-lista"><i class="ri-map-pin-line texto-apagado"></i>
                        <div class="meta"><strong>Endereço</strong><span>Av. Faria Lima, 1200 — São Paulo/SP</span></div></div>
                    <div class="linha-lista"><i class="ri-time-line texto-apagado"></i>
                        <div class="meta"><strong>Horário</strong><span>Seg a Sex, 08h às 19h</span></div></div>
                    <div class="linha-lista"><i class="ri-phone-line texto-apagado"></i>
                        <div class="meta"><strong>Telefone</strong><span>(11) 4002-8899</span></div></div>
                </div>

                <!-- Ações do paciente -->
                <div class="cartao cartao-corpo">
                    <div class="cartao-titulo"><h3>Ações</h3></div>
                    <div class="acoes-rapidas">
                        <div class="acao-rapida" onclick="location.href='agenda.html'">
                            <i class="ri-calendar-event-line"></i><span>Ver minha agenda</span>
                        </div>
                        <div class="acao-rapida" onclick="location.href='pagamentos.html'">
                            <i class="ri-bank-card-line"></i><span>Financeiro</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

/* ------------------------------------------------------------------
   GRÁFICO DE BARRAS
   Recebe: id do lugar onde colocar, valores, rótulos, prefixo (R$)
   Calcula a altura de cada barra proporcional ao valor máximo.
------------------------------------------------------------------ */
function montarGrafico(id, valores, rotulos, prefixo) {
    const maior = Math.max(...valores);   // o maior valor define 100% de altura

    document.getElementById(id).innerHTML = valores.map((valor, i) => {
        const altura = (valor / maior) * 100;   // altura em porcentagem
        return `
            <div class="barra-col">
                <!-- A altura é colocada direto no estilo por ser um valor calculado -->
                <div class="barra" style="height:${altura}%" title="${prefixo}${valor.toLocaleString('pt-BR')}"></div>
                <div class="barra-rotulo">${rotulos[i]}</div>
            </div>`;
    }).join('');
}

/* ------------------------------------------------------------------
   INÍCIO DA PÁGINA
   Espera o HTML estar pronto, pega o perfil e monta o dashboard.
------------------------------------------------------------------ */
function iniciarDashboard() {
    /* O perfil pode mudar o título mostrado na topbar */
    if (localStorage.getItem('ps-role') === 'paciente') {
        PSLayout.trocarTitulo('Início', 'Seu espaço pessoal Pure Smile');
    }

    /* Escolhe qual dashboard montar */
    if (localStorage.getItem('ps-role') === 'paciente') {
        montarDashboardPaciente();
    } else {
        montarDashboardClínica();
    }

    /* Anima os cartões e gráficos de leve (GSAP) */
    if (typeof gsap !== 'undefined') {
        gsap.from('.stat-card', { opacity: 0, y: 16, stagger: 0.08, duration: 0.5, ease: 'power2.out' });
        gsap.from('.dash-colunas .cartao', { opacity: 0, y: 16, stagger: 0.08, duration: 0.5, delay: 0.2, ease: 'power2.out' });
        gsap.from('.barra', { height: 0, stagger: 0.05, duration: 0.7, delay: 0.4, ease: 'power2.out' });
    }
}

/* Espera o HTML terminar de carregar antes de montar */
document.addEventListener('DOMContentLoaded', iniciarDashboard);