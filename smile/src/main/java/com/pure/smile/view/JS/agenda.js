/* =====================================================================
   AGENDA.JS — Grade semanal e diária de consultas
   ---------------------------------------------------------------------
   Monta o calendário a partir de DADOS.consultas (dados.js):
   - visão SEMANAL: 7 colunas (Seg a Dom), eventos posicionados pelo
     horário e duração no tempo real
   - visão DIÁRIA: só o dia de hoje, com coluna maior
   - datas do cabeçalho calculadas à partir do dia atual
   - arrastar um card para outra coluna reagenda (muda o "dia")
   - botão "Agendar consulta" abre um modal que cria nova consulta
   ===================================================================== */

/* Nomes e abreviações dos dias */
const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const DIAS_CURTO = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

/* Horário inicial e tamanho de cada slot (referente ao CSS) */
const HORA_INICIO = 7;   // a grade começa às 7:00
const SLOT_HEIGHT = 76;  // cada hora tem 76px

/* ---------------------------------------------------------------
   DATA DE HOJE E SEMANA ATUAL
   seg = segunda-feira da semana do dia atual.
   Hoje fica salvo para marcar .is-today no cabeçalho.
--------------------------------------------------------------- */
function semanaAtual() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    /* Quanto falta para voltar até segunda (dow: 0=dom, 1=seg...) */
    const diasAteSegunda = (hoje.getDay() + 6) % 7;
    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() - diasAteSegunda);

    /* Gera um array com os 7 dias (Seg a Dom) */
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(segunda);
        d.setDate(segunda.getDate() + i);
        return d;
    });
}

/* Converte o Date em "dd/mm" para o cabeçalho */
function formatoDia(date) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/* ---------------------------------------------------------------
   CONSULTAS QUE O USUÁRIO PODE VER
   Dentista / Secretária / Admin: agenda toda.
   Paciente: só as consultas DELE (é a "Minha agenda").
--------------------------------------------------------------- */
function consultasVisiveis() {
    if (localStorage.getItem('ps-role') === 'paciente') {
        return DADOS.consultas.filter(c => c.paciente === pacienteLogado().nome);
    }
    return DADOS.consultas;
}

/* ---------------------------------------------------------------
   CALCULAR POSIÇÃO DO EVENTO
   - top  : quantos pixels descer a partir das 7:00
   - altura: largura proporcional à duração
--------------------------------------------------------------- */
function posicaoConsulta(c) {
    const [hora, min] = c.horario.split(':').map(Number);
    const emMinutos = (hora - HORA_INICIO) * 60 + min;   // minutos desde as 7h
    const top = Math.round((emMinutos / 60) * SLOT_HEIGHT);
    const altura = Math.max(30, Math.round((c.duracao / 60) * SLOT_HEIGHT));
    return { top, altura };
}

/* Consultas que o usuário PODE arrastar (só a equipe da clínica) */
const PODE_ARRAGAR = localStorage.getItem('ps-role') !== 'paciente';

/* ---------------------------------------------------------------
   CARD DA CONSULTA (um bloco colorido na grade)
   O id é guardado no data-id para o drag & drop encontrar.
--------------------------------------------------------------- */
function cardConsulta(c) {
    const { top, altura } = posicaoConsulta(c);
    return `
        <div class="cal-event st-${c.status}" style="top:${top}px;height:${altura}px"
             draggable="${PODE_ARRAGAR}" data-id="${c.id}"
             title="${c.paciente} · ${c.horario} · ${c.procedimento}">
            ${c.paciente}<span>${c.horario} · ${c.procedimento}</span>
        </div>`;
}

/* ---------------------------------------------------------------
   MONTAR CABEÇALHO DA SEMANA (7 dias com data real)
--------------------------------------------------------------- */
function cabecalhoSemana(dias) {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);

    let html = `<div class="cal-head"></div>`;   // célula vazia antes das horas
    dias.forEach((dia, i) => {
        const ehHoje = dia.getTime() === hoje.getTime();
        html += `
            <div class="cal-head ${ehHoje ? 'is-today' : ''}">
                <strong>${DIAS_CURTO[i]}</strong>
                <span>${ehHoje ? 'Hoje · ' : ''}${formatoDia(dia)}</span>
            </div>`;
    });
    return html;
}

/* ---------------------------------------------------------------
   COLUNA DE HORÁRIOS (7:00 até 18:00)
--------------------------------------------------------------- */
function colunaHoras() {
    let html = `<div class="cal-time-col">`;
    for (let h = HORA_INICIO; h <= 18; h++) {
        html += `<div class="cal-time-slot">${h}:00</div>`;
    }
    return html + `</div>`;
}

/* ---------------------------------------------------------------
   COLUNA DE UM DIA (n = 1 a 7)
   Recebe as consultas que acontecem nesse dia e desenha os cards.
   O atributo data-dia-guia identifica a coluna para o drag & drop.
--------------------------------------------------------------- */
function colunaDia(diaNumero, consultas) {
    return `
        <div class="cal-day-col" data-dia-guia="${diaNumero}">
            ${consultas.map(cardConsulta).join('')}
        </div>`;
}

/* ---------------------------------------------------------------
   MONTAR A GRADE
   view = 'week' (semanal) ou 'day' (diária)
--------------------------------------------------------------- */
function montarGrade(view) {
    const grade = document.getElementById('gradeAgenda');
    const dias = semanaAtual();
    const consultas = consultasVisiveis();
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);

    let html = '';

    if (view === 'week') {
        /* Grade semanal: cabeçalho + horas + 7 colunas */
        html = `<div class="calendar visao-semana" id="calendario">`;
        html += cabecalhoSemana(dias);
        html += colunaHoras();
        for (let d = 1; d <= 7; d++) {
            html += colunaDia(d, consultas.filter(c => c.dia === d));
        }
    } else {
        /* Grade diária: só o dia de hoje */
        const hojeNumero = hoje.getDay() === 0 ? 7 : hoje.getDay();   // domingo = 7
        html = `<div class="calendar visao-dia" id="calendario">`;
        html += `
            <div class="cal-head"></div>
            <div class="cal-head is-today">
                <strong>${DIAS[hojeNumero - 1]}</strong>
                <span>${formatoDia(hoje)}</span>
            </div>`;
        html += colunaHoras();
        html += colunaDia(hojeNumero, consultas.filter(c => c.dia === hojeNumero));
    }

    html += `</div>`;

    grade.innerHTML = html;

    ligarArrasto();   // habilita arrastar os cards novamente
    animarEntrada();  // anima os cards de leve
}

/* ---------------------------------------------------------------
   DRAG & DROP (reagendar)
   dragstart: guarda qual consulta está sendo arrastada.
   dragenter/leave: destaca a coluna alvo.
   drop: muda o dia da consulta e re-monta a grade.
--------------------------------------------------------------- */
function ligarArrasto() {
    document.querySelectorAll('.cal-event[draggable="true"]').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            card.classList.add('is-arrastando');
            e.dataTransfer.setData('text/plain', card.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        card.addEventListener('dragend', () => card.classList.remove('is-arrastando'));
    });

    document.querySelectorAll('.cal-day-col[data-dia-guia]').forEach(col => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault();           // obrigatório para permitir soltar
            col.classList.add('drag-over');
        });
        col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.classList.remove('drag-over');

            /* Acha a consulta pelo id guardado no arraste */
            const id = Number(e.dataTransfer.getData('text/plain'));
            const consulta = DADOS.consultas.find(c => c.id === id);
            if (!consulta) return;

            const novoDia = Number(col.dataset.diaGuia);
            if (consulta.dia === novoDia) return;   // soltou no mesmo dia

            consulta.dia = novoDia;   // muda o dia (simula o banco)
            montarGrade(visaoAtual());
            AJUDA.toast(`Consulta de ${consulta.paciente} reagendada para ${DIAS[novoDia - 1]}!`, 'sucesso');
        });
    });
}

/* ---------------------------------------------------------------
   ANIMAÇÃO DE ENTRADA (GSAP)
--------------------------------------------------------------- */
function animarEntrada() {
    if (typeof gsap === 'undefined') return;
    gsap.from('.cal-event', { opacity: 0, y: 8, stagger: 0.03, duration: 0.4, ease: 'power2.out' });
    gsap.from('.cal-head', { opacity: 0, y: -6, stagger: 0.02, duration: 0.3, ease: 'power2.out' });
}

/* ---------------------------------------------------------------
   SALVAR NOVA CONSULTA (modal)
   Junta os campos do formulário e adiciona em DADOS.consultas.
--------------------------------------------------------------- */
function salvarConsulta() {
    const form = document.getElementById('formAgendar');
    if (!form.checkValidity()) {
        form.reportValidity();   // navegador mostra os campos faltando
        return;
    }

    const novo = {
        id: DADOS.consultas.length + 1,
        paciente: document.getElementById('agPaciente').value,
        dentista: document.getElementById('agDentista').value,
        dia: Number(document.getElementById('agDia').value),
        horario: document.getElementById('agHorario').value,
        duracao: Number(document.getElementById('agDuracao').value),
        procedimento: document.getElementById('agProcedimento').value,
        status: 'confirmada',   // consulta nova já nasce confirmada
    };

    DADOS.consultas.push(novo);

    AJUDA.fecharModal('modalAgendar');
    AJUDA.toast(`Consulta de ${novo.paciente} agendada!`, 'sucesso');
    form.reset();
    montarGrade(visaoAtual());
}

/* ---------------------------------------------------------------
   VISÃO ATUAL (para re-desenhar mantendo o que o usuário escolheu)
--------------------------------------------------------------- */
function visaoAtual() {
    const ativo = document.querySelector('.agenda-view-switch button.is-active');
    return ativo ? ativo.dataset.view : 'week';
}

/* ---------------------------------------------------------------
   INÍCIO DA PÁGINA: eventos da toolbar e do modal
--------------------------------------------------------------- */
function iniciarAgenda() {
    const ehPaciente = localStorage.getItem('ps-role') === 'paciente';

    /* Paciente não agenda (fala com a clínica) nem arrasta cards */
    if (ehPaciente) {
        document.getElementById('btnAgendar').style.display = 'none';
        document.querySelector('.agenda-hint').innerHTML =
            '<i class="ri-calendar-2-line"></i> Esta é a sua agenda de consultas na clínica.';
    }

    /* Preenche os selects do modal */
    document.getElementById('agPaciente').innerHTML =
        DADOS.pacientes.map(p => `<option>${p.nome}</option>`).join('');
    document.getElementById('agDentista').innerHTML =
        DADOS.dentistas.map(d => `<option>${d.nome}</option>`).join('');

    /* Toggle Semanal / Diário */
    document.querySelectorAll('.agenda-view-switch button').forEach(btn =>
        btn.addEventListener('click', () => {
            document.querySelectorAll('.agenda-view-switch button').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            montarGrade(btn.dataset.view);
        })
    );

    /* Botão "Hoje": volta para a visão semanal (semana corrente) */
    document.getElementById('btnHoje').addEventListener('click', () => {
        document.querySelectorAll('.agenda-view-switch button').forEach(b =>
            b.classList.toggle('is-active', b.dataset.view === 'week'));
        montarGrade('week');
    });

    /* Modal de agendar */
    document.getElementById('btnAgendar').addEventListener('click',
        () => AJUDA.abrirModal('modalAgendar'));
    document.querySelectorAll('[data-fechar-modal]').forEach(b =>
        b.addEventListener('click', () => AJUDA.fecharModal('modalAgendar')));
    document.getElementById('btnSalvarAgendar').addEventListener('click', salvarConsulta);
    document.getElementById('modalAgendar').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) AJUDA.fecharModal('modalAgendar');
    });

    /* Monta a grade inicial (semanal) */
    montarGrade('week');
}

document.addEventListener('DOMContentLoaded', iniciarAgenda);