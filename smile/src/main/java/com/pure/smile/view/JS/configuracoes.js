/* =====================================================================
   CONFIGURACOES.JS — Página de Configurações do sistema
   ---------------------------------------------------------------------
   Reúne as preferências da clínica em abas:
   - Preferências  (nome da clínica, horários, cancelamentos)
   - Segurança     (senha + autenticação)
   - Usuários      (apenas Admin; tabela da equipe)
   - Aparência     (tema claro/escuro + idioma)
   - Notificações  (ligar/desligar avisos)

   Tudo é simulado em memória com toast de confirmação.
   ===================================================================== */

/* ------------------------------------------------------------------
   MONTAR A PÁGINA INTEIRA
------------------------------------------------------------------ */
function montarPagina() {
    const admin = (localStorage.getItem('ps-role') === 'admin');
    const usuarios = Object.values(DADOS.usuarios);   // lista de usuários

    document.getElementById('conteudoConfiguracoes').innerHTML = `
        <div class="cartao cartao-corpo">
            <div class="abas">
                <button class="aba ativa" data-alvo="cfgPrefs">Preferências</button>
                <button class="aba" data-alvo="cfgSeguranca">Segurança</button>
                ${admin ? '<button class="aba" data-alvo="cfgUsuarios">Usuários</button>' : ''}
                <button class="aba" data-alvo="cfgAparencia">Aparência</button>
                <button class="aba" data-alvo="cfgNotif">Notificações</button>
            </div>

            <!-- ABA 1: Preferências da clínica -->
            <div class="painel ativo" id="cfgPrefs">
                <div class="flex flex-centro gap-md margem-baixo-md">
                    <div class="config-icone"><i class="ri-building-line"></i></div>
                    <div>
                        <h3 style="font-family:var(--font-titulo);font-size:var(--texto-md);">Dados da clínica</h3>
                        <p class="texto-pequeno texto-apagado">Informações exibidas em documentos e relatórios.</p>
                    </div>
                </div>

                <div class="grade-form">
                    <div class="campo dupla">
                        <label>Nome da clínica</label>
                        <input class="input" value="Clínica Odontológica Pure Smile">
                    </div>
                    <div class="campo">
                        <label>Abertura</label>
                        <input class="input" value="08:00">
                    </div>
                    <div class="campo">
                        <label>Encerramento</label>
                        <input class="input" value="19:00">
                    </div>
                    <div class="campo dupla">
                        <label>Política de cancelamento</label>
                        <select class="input">
                            <option>Cobrar taxa de R$ 50,00</option>
                            <option>Não cobrar taxa</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primario" id="cfgSalvarPrefs"><i class="ri-save-3-line"></i> Salvar preferências</button>
            </div>

            <!-- ABA 2: Segurança -->
            <div class="painel" id="cfgSeguranca">
                <div class="aviso aviso-info">
                    <i class="ri-shield-check-line"></i>
                    <div>
                        <strong>Autenticação</strong>
                        <p class="texto-apagado">Aqui você controla a senha do administrador e o mecanismo de login.</p>
                    </div>
                </div>

                <div class="grade-form">
                    <div class="campo">
                        <label>Usuário administrador</label>
                        <input class="input" value="rodrigo.fialho" disabled>
                    </div>
                    <div class="campo">
                        <label>Nova senha</label>
                        <input class="input" type="password" placeholder="••••••••">
                    </div>
                    <div class="campo dupla">
                        <label class="linha-checkbox">
                            <input type="checkbox" checked> Exigir login para usar o sistema
                        </label>
                        <label class="linha-checkbox">
                            <input type="checkbox"> Bloquear acesso após 3 tentativas erradas
                        </label>
                    </div>
                </div>
                <button class="btn btn-primario" id="cfgSalvarSeg"><i class="ri-lock-2-line"></i> Salvar segurança</button>
            </div>

            <!-- ABA 3: Usuários (só admin vê) -->
            <div class="painel" id="cfgUsuarios">
                <div class="flex espaco-entre margem-baixo-md">
                    <p class="texto-pequeno texto-apagado">Equipe que pode acessar o sistema (${usuarios.length} usuários).</p>
                    <button class="btn btn-acento btn-pequeno" id="cfgNovoUsuario"
                            onclick="AJUDA.toast('Cadastro de novos usuários chega na versão 2.0.')">
                        <i class="ri-user-add-line"></i> Novo usuário
                    </button>
                </div>

                <div class="tabela-enrole usuarios-lista">
                    <table class="lista">
                        <thead><tr><th>Usuário</th><th>Perfil</th><th>Função</th><th>Ações</th></tr></thead>
                        <tbody>
                            ${usuarios.map(u => `
                                <tr>
                                    <td><div class="celula-perfil">
                                        <img src="${u.avatar}" alt="">
                                        <span class="nome">${u.nome}</span>
                                    </div></td>
                                    <td>${u.perfil}</td>
                                    <td>${u.especialidade || u.cargo || u.convenio || '—'}</td>
                                    <td>
                                        <button class="btn btn-fantasma btn-pequeno"
                                                onclick="AJUDA.toast('Edição de usuários disponível na versão 2.0.')">
                                            <i class="ri-pencil-line"></i>
                                        </button>
                                    </td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ABA 4: Aparência -->
            <div class="painel" id="cfgAparencia">
                <div class="grade-form">
                    <div class="campo dupla">
                        <label>Idioma do sistema</label>
                        <select class="input">
                            <option>Português (Brasil)</option>
                            <option>English (US)</option>
                            <option>Español</option>
                        </select>
                    </div>
                    <div class="campo dupla">
                        <label>Modo de cor</label>
                        <select class="input" id="cfgSelectTema">
                            <option value="dark">Escuro</option>
                            <option value="light">Claro</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primario" id="cfgSalvarAparencia"><i class="ri-save-3-line"></i> Salvar aparência</button>
            </div>

            <!-- ABA 5: Notificações -->
            <div class="painel" id="cfgNotif">
                <label class="linha-checkbox">
                    <input type="checkbox" checked> Notificar paciente sobre consulta agendada
                </label>
                <label class="linha-checkbox">
                    <input type="checkbox" checked> Lembrar pacientes 24h antes da consulta
                </label>
                <label class="linha-checkbox">
                    <input type="checkbox"> Avisar a secretaria quando um pagamento atrasar
                </label>
                <label class="linha-checkbox">
                    <input type="checkbox"> Receber resumo semanal por e-mail
                </label>
                <button class="btn btn-primario margem-topo-md" id="cfgSalvarNotif">
                    <i class="ri-notification-3-line"></i> Salvar notificações
                </button>
            </div>
        </div>`;

    /* Liga as abas */
    document.querySelectorAll('.aba').forEach(aba =>
        aba.addEventListener('click', () => AJUDA.trocarAba(aba))
    );

    /* Toasts de confirmação de cada aba */
    document.getElementById('cfgSalvarPrefs').addEventListener('click',
        () => AJUDA.toast('Preferências salvas com sucesso!', 'sucesso'));
    document.getElementById('cfgSalvarSeg').addEventListener('click',
        () => AJUDA.toast('Segurança atualizada.', 'sucesso'));
    document.getElementById('cfgSalvarNotif').addEventListener('click',
        () => AJUDA.toast('Notificações atualizadas.', 'sucesso'));

    /* Aparência: aplicar tema na hora + guardar no navegador */
    const selectTema = document.getElementById('cfgSelectTema');
    selectTema.value = localStorage.getItem('ps-tema') || 'dark';
    document.getElementById('cfgSalvarAparencia').addEventListener('click', () => {
        localStorage.setItem('ps-tema', selectTema.value);
        document.documentElement.setAttribute('data-theme', selectTema.value);
        AJUDA.toast('Aparência atualizada!', 'sucesso');
        /* Atualiza o ícone do botão de tema da topbar */
        PSLayout.initTheme();
    });
}

document.addEventListener('DOMContentLoaded', montarPagina);