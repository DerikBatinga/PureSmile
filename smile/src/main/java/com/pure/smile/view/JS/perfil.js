/* =====================================================================
   PERFIL.JS — Página "Meu Perfil" do usuário logado
   ---------------------------------------------------------------------
   Mostra o cartão do usuário (foto, nome, tipo) e uma área com abas:
   - Editar perfil (formulário de dados)
   - Alterar senha (formulário com validação simples)
   - Preferências de notificação
   Tudo é simulado em memória + toast de confirmação.
   ===================================================================== */

/* ------------------------------------------------------------------
   MONTAR A PÁGINA INTEIRA
------------------------------------------------------------------ */
function montarPagina() {
    const usuario = usuarioLogado();   // funções de dados.js

    document.getElementById('conteudoPerfil').innerHTML = `
        <!-- Cabeçalho do perfil -->
        <div class="cartao perfil-cap margem-baixo-lg">
            <img src="${usuario.avatar}" alt="${usuario.nome}">
            <div class="meio">
                <h3>${usuario.nome}</h3>
                <p>${usuario.perfil} · ${usuario.especialidade || usuario.cargo || usuario.convenio || ''}</p>
            </div>
            <div class="flex flex-centro gap-sm">
                <button class="btn btn-secundario" id="btnFoto" onclick="AJUDA.toast('A alteração de foto estará disponível em breve.')">
                    <i class="ri-camera-line"></i> Alterar foto
                </button>
            </div>
        </div>

        <!-- Cartão com abas -->
        <div class="cartao cartao-corpo">
            <div class="abas">
                <button class="aba ativa" data-alvo="abaEditar">Editar perfil</button>
                <button class="aba" data-alvo="abaSenha">Alterar senha</button>
                <button class="aba" data-alvo="abaPrefs">Preferências</button>
            </div>

            <!-- ABA 1: editar dados -->
            <div class="painel ativo" id="abaEditar">
                <div class="grade-form">
                    <div class="campo">
                        <label>Nome completo</label>
                        <input class="input" id="pfNome" value="${usuario.nome}">
                    </div>
                    <div class="campo">
                        <label>E-mail</label>
                        <input class="input" id="pfEmail" value="${usuario.perfil === 'Paciente' ? 'marina.alves@gmail.com' : 'contato@puresmile.com'}">
                    </div>
                    <div class="campo">
                        <label>Telefone</label>
                        <input class="input" id="pfTelefone" value="${usuario.perfil === 'Paciente' ? '(11) 99284-1120' : '(11) 4002-8899'}">
                    </div>
                    <div class="campo">
                        <label>Especialidade / Cargo</label>
                        <input class="input" value="${usuario.especialidade || usuario.cargo || usuario.convenio || '—'}" disabled>
                    </div>
                </div>
                <button class="btn btn-primario margem-topo-md" id="btnSalvarPerfil">
                    <i class="ri-save-3-line"></i> Salvar alterações
                </button>
            </div>

            <!-- ABA 2: alterar senha -->
            <div class="painel" id="abaSenha">
                <!-- Aviso amarelo sobre a regra de senha -->
                <div class="aviso aviso-info">
                    <i class="ri-information-line"></i>
                    <div>
                        <strong>Regra de segurança</strong>
                        <p class="texto-apagado">A nova senha deve ter pelo menos 8 caracteres e 1 número.</p>
                    </div>
                </div>

                <div class="grade-form">
                    <div class="campo">
                        <label>Senha atual</label>
                        <input class="input" type="password" id="pfSenhaAtual" placeholder="••••••••">
                    </div>
                    <div class="campo">
                        <label>Nova senha</label>
                        <input class="input" type="password" id="pfNovaSenha" placeholder="Mínimo 8 caracteres">
                    </div>
                </div>
                <button class="btn btn-primario margem-topo-md" id="btnTrocarSenha">
                    <i class="ri-lock-2-line"></i> Alterar senha
                </button>
            </div>

            <!-- ABA 3: preferências -->
            <div class="painel" id="abaPrefs">
                <label class="linha-checkbox">
                    <input type="checkbox" checked> Receber lembretes de consultas por e-mail
                </label>
                <label class="linha-checkbox">
                    <input type="checkbox" checked> Receber avisos de pagamentos pendentes
                </label>
                <label class="linha-checkbox">
                    <input type="checkbox"> Receber novidades e campanhas da clínica
                </label>
                <button class="btn btn-primario margem-topo-md" id="btnSalvarPrefs">
                    <i class="ri-save-3-line"></i> Salvar preferências
                </button>
            </div>
        </div>`;

    /* Liga as abas (a função trocarAba fica em auxiliares.js) */
    document.querySelectorAll('.aba').forEach(aba =>
        aba.addEventListener('click', () => AJUDA.trocarAba(aba))
    );

    /* Toasts de confirmação dos formulários */
    document.getElementById('btnSalvarPerfil').addEventListener('click',
        () => AJUDA.toast('Perfil atualizado com sucesso!', 'sucesso'));
    document.getElementById('btnSalvarPrefs').addEventListener('click',
        () => AJUDA.toast('Preferências salvas.', 'sucesso'));

    /* Troca de senha: validação simples e didática */
    document.getElementById('btnTrocarSenha').addEventListener('click', () => {
        const nova = document.getElementById('pfNovaSenha').value;
        const atual = document.getElementById('pfSenhaAtual').value;

        /* Regra didática: senha precisa de 8+ caracteres com pelo menos 1 número */
        if (!atual) { AJUDA.toast('Informe a senha atual.', 'aviso'); return; }
        if (nova.length < 8 || !/\d/.test(nova)) {
            AJUDA.toast('Senha muito fraca. Use ao menos 8 caracteres e 1 número.', 'erro');
            return;
        }
        AJUDA.toast('Senha alterada com sucesso!', 'sucesso');
        document.querySelectorAll('#abaSenha input').forEach(i => i.value = '');
    });
}

document.addEventListener('DOMContentLoaded', montarPagina);