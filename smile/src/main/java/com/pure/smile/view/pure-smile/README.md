# Pure Smile — Front-end

Front-end completo do sistema de gestão odontológica **Pure Smile**, desenvolvido em HTML5, CSS3 e JavaScript puro (sem frameworks), pronto para futura integração com back-end em **Java + Maven + MySQL + JDBC**.

## Como abrir

Basta abrir `index.html` em um navegador (ou servir a pasta com qualquer servidor estático). Não há dependência de build.

## Login de demonstração

Como ainda não existe back-end, a tela de login permite escolher o **perfil de acesso** (Dentista, Secretaria, Administrador ou Paciente) através dos chips acima do formulário. Qualquer e-mail/senha preenchidos são aceitos — o clique em "Entrar" grava o perfil escolhido em `localStorage` e redireciona para o dashboard correspondente.

Para trocar de perfil durante os testes, é só sair (botão "Sair" no menu do avatar ou na sidebar) e entrar novamente escolhendo outro perfil.

## Estrutura de pastas

```
pure-smile/
├── index.html              → Tela 1: Login
├── dashboard.html           → Tela 2: Dashboard (varia por perfil)
├── pacientes.html           → Tela 3: Listagem de pacientes
├── paciente-detalhes.html   → Tela 3b: Perfil detalhado do paciente
├── agenda.html               → Tela 4: Agenda (semanal/diária)
├── procedimentos.html        → Tela 5: Procedimentos
├── pagamentos.html           → Tela 6: Financeiro
├── perfil.html                → Tela 7: Perfil do usuário logado
├── configuracoes.html        → Tela 8: Configurações do sistema
├── css/
│   ├── tokens.css   → Design tokens (cores, tipografia, espaçamento) — light & dark
│   └── base.css     → Reset + Design System (componentes reutilizáveis)
└── js/
    ├── mock-data.js  → Dados fictícios (equivalentes às futuras tabelas MySQL)
    ├── common.js     → Helpers compartilhados (badges, moeda, modais, stat cards)
    ├── theme.js      → Motor de dark mode com persistência
    ├── toast.js      → Sistema de notificações toast
    ├── layout.js     → Monta sidebar/topbar de acordo com o perfil logado
    └── [pagina].js   → Lógica específica de cada tela
```

## Perfis de acesso implementados

| Perfil        | Menu lateral                                                        |
|----------------|----------------------------------------------------------------------|
| Dentista       | Dashboard, Pacientes, Agenda, Procedimentos, Perfil                  |
| Secretaria     | Dashboard, Pacientes, Agenda, Pagamentos, Perfil                     |
| Administrador  | Dashboard, Pacientes, Agenda, Procedimentos, Pagamentos, Configurações, Perfil |
| Paciente       | Início, Minha Agenda, Meus Procedimentos, Financeiro, Perfil (somente os próprios dados) |

## Observações para a integração futura com Java + MySQL

- `js/mock-data.js` foi estruturado propositalmente como um array de objetos "achatado" (equivalente a um `SELECT *`), facilitando a troca por chamadas `fetch()` a uma API Java (Servlet/Spring) que devolva JSON no mesmo formato.
- `localStorage.getItem('ps-role')` hoje simula a sessão autenticada; na versão final isso deve vir de uma sessão HTTP validada no servidor (login real com JDBC + tabela de usuários).
- Os modais de cadastro (Novo Paciente, Nova Consulta, Novo Procedimento) já têm todos os campos exigidos pelo escopo e só precisam ser conectados a um `POST` real.
