/* =====================================================================
   PACIENTES.JS — Lista, filtro, busca e cadastro de pacientes
   ---------------------------------------------------------------------
   Aqui pegamos a lista DADOS.pacientes (de dados.js) e mostramos na
   tabela. Toda vez que o filtro ou a busca muda, a lista é RE-MONTADA
   pela função montarTabela().
   ===================================================================== */

/* ------------------------------------------------------------------
   MONTAR TABELA
   Recebe um filtro (status) e um texto de busca, filtra a lista
   e desenha as linhas na tabela. Se não sobrar nada, mostra o aviso.
------------------------------------------------------------------ */
function montarTabela() {
    const filtro = document.querySelector('.filtro-chip.ativo').dataset.status;  // status escolhido
    const busca  = document.getElementById('buscaPaciente').value.trim().toLowerCase(); // texto digitado
    const corpo  = document.getElementById('corpoPacientes');

    /* Filtra por status e também pelo texto da busca (nome ou CPF) */
    const resultado = DADOS.pacientes.filter(p =>
        (filtro === 'todos' || p.status === filtro) &&
        (!busca || p.nome.toLowerCase().includes(busca) || p.cpf.replace(/\D/g, '').includes(busca.replace(/\D/g, '')))
    );

    /* Monta as linhas da tabela, uma por paciente encontrado */
    corpo.innerHTML = resultado.map(p => `
        <tr>
            <td>
                <div class="celula-perfil">
                    <img src="${p.avatar}" alt="">
                    <div>
                        <span class="nome">${p.nome}</span>
                        <small class="sub">#${String(p.id).padStart(3, '0')}</small>
                    </div>
                </div>
            </td>
            <td>${p.cpf}</td>
            <td>${p.telefone}</td>
            <td>${p.convenio}</td>
            <td>${AJUDA.selo(p.status)}</td>
            <td>
                <div class="flex flex-centro gap-sm">
                    <button class="btn btn-fantasma btn-pequeno" title="Ver detalhes"
                            onclick="location.href='paciente-detalhes.html?id=${p.id}'">
                        <i class="ri-eye-line"></i>
                    </button>
                    <button class="btn btn-fantasma btn-pequeno" title="Editar"
                            onclick="AJUDA.toast('Edição em desenvolvimento na versão 2.0.')">
                        <i class="ri-pencil-line"></i>
                    </button>
                </div>
            </td>
        </tr>`).join('');

    /* Mostra ou esconde o aviso de "nada encontrado" */
    document.getElementById('pacientesVazio').hidden = resultado.length !== 0;
}

/* ------------------------------------------------------------------
   CADASTRO DE NOVO PACIENTE
   Junta os campos do modal no formato usado pela tabela e adiciona
   na lista DADOS.pacientes (em memória). Depois fecha o modal,
   mostra o toast de sucesso e re-monta a tabela.
------------------------------------------------------------------ */
function salvarNovoPaciente() {
    const form = document.getElementById('formNovoPaciente');

    /* Se algum campo obrigatório estiver vazio, o navegador pede e não segue */
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const novo = {
        id: DADOS.pacientes.length + 1,
        nome: document.getElementById('fNovaNome').value,
        cpf: document.getElementById('fNovaCpf').value,
        telefone: document.getElementById('fNovaTelefone').value,
        nascimento: document.getElementById('fNovaNascimento').value,
        convenio: document.getElementById('fNovaConvenio').value,
        email: document.getElementById('fNovaEmail').value,
        status: 'ativo',                      // todo cadastro novo já começa ativo
        avatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(document.getElementById('fNovaNome').value)}`,
    };

    /* Adiciona na lista em memória */
    DADOS.pacientes.unshift(novo);

    /* Fecha o modal e liga o toast de sucesso */
    AJUDA.fecharModal('modalNovoPaciente');
    AJUDA.toast('Paciente cadastrado com sucesso!', 'sucesso');

    /* Volta o filtro para "Todos" e re-desenha a tabela */
    form.reset();
    document.querySelectorAll('.filtro-chip').forEach(c => c.classList.toggle('ativo', c.dataset.status === 'todos'));
    montarTabela();
}

/* ------------------------------------------------------------------
   INÍCIO DA PÁGINA: liga os eventos e desenha a tabela
------------------------------------------------------------------ */
function iniciarPacientes() {
    montarTabela();   // primeira renderização

    /* Clique nos chips de filtro muda o filtro ativo e re-desenha */
    document.querySelectorAll('.filtro-chip').forEach(chip =>
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filtro-chip').forEach(c => c.classList.remove('ativo'));
            chip.classList.add('ativo');
            montarTabela();
        })
    );

    /* Digitar na busca re-desenha a tabela conforme o texto */
    document.getElementById('buscaPaciente').addEventListener('input', montarTabela);

    /* Abre/fecha o modal de cadastro */
    document.getElementById('btnNovoPaciente').addEventListener('click', () => AJUDA.abrirModal('modalNovoPaciente'));
    document.querySelectorAll('[data-fechar-modal]').forEach(b =>
        b.addEventListener('click', () => AJUDA.fecharModal('modalNovoPaciente'))
    );

    /* Botão "Salvar" do formulário */
    document.getElementById('btnSalvarPaciente').addEventListener('click', salvarNovoPaciente);

    /* Botão que aparece no aviso de vazio, zera os filtros */
    document.getElementById('btnLimparFiltros').addEventListener('click', () => {
        document.getElementById('buscaPaciente').value = '';
        document.querySelectorAll('.filtro-chip').forEach(c => c.classList.toggle('ativo', c.dataset.status === 'todos'));
        montarTabela();
    });

    /* Fecha o modal ao clicar fora do cartão (no fundo escuro) */
    document.getElementById('modalNovoPaciente').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) AJUDA.fecharModal('modalNovoPaciente');
    });

    /* Anima as linhas da tabela de leve (GSAP) */
    if (typeof gsap !== 'undefined') {
        gsap.from('#corpoPacientes tr', { opacity: 0, y: 8, stagger: 0.03, duration: 0.4, ease: 'power2.out' });
    }
}

/* Espera o HTML terminar de carregar antes de montar */
document.addEventListener('DOMContentLoaded', iniciarPacientes);