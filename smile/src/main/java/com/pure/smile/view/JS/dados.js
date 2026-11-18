/* =====================================================================
   DADOS.JS — Dados fictícios do Pure Smile
   ---------------------------------------------------------------------
   ESTA FUNÇÃO SIMULA O QUE NO FUTURO VIRÁ DO BANCO DE DADOS
   (Java + MySQL). São listas de objetos que representam as
   "tabelas" do banco:

   - usuarios      → quem usa o sistema (dentista, secretaria, admin)
   - pacientes     → cadastro de pacientes
   - consultas     → agendamentos (a agenda)
   - procedimentos → procedimentos realizados
   - pagamentos    → financeiro / contas a receber

   Todas as páginas leem esses dados. Para "simular o banco"
   a gente guarda tudo em um objeto chamado DADOS.
   ===================================================================== */

const DADOS = {

    /* ------------------------------------------------------------------
       USUÁRIOS LOGADOS
       Cada perfil tem um usuário exemplo. É usado no perfil.html (página de perfil) e no painel da sidebar.
    ------------------------------------------------------------------ */
    usuarios: {
        dentista:    { nome: "Dra. Camila Ferraz",   perfil: "Dentista",      especialidade: "Ortodontia",    avatar: "https://i.pravatar.cc/100?img=47" },
        funcionario: { nome: "Ana Beatriz Lima",     perfil: "Secretaria",    cargo: "Recepção e Cadastros",  avatar: "https://i.pravatar.cc/100?img=44" },
        admin:       { nome: "Rodrigo Fialho",       perfil: "Administrador", cargo: "Administração Geral",    avatar: "https://i.pravatar.cc/100?img=68" },
        paciente:    { nome: "Marina Souza Alves",   perfil: "Paciente",      convenio: "Amil Dental",         avatar: "https://i.pravatar.cc/100?img=5"  },
    },

    /* ------------------------------------------------------------------
       EQUIPE DE DENTISTAS
       - status: ativo | ferias | pendente
    ------------------------------------------------------------------ */
    dentistas: [
        { id: 1, nome: "Dra. Camila Ferraz",   especialidade: "Ortodontia",     avatar: "https://i.pravatar.cc/100?img=47", status: "ativo",  pacientes: 84 },
        { id: 2, nome: "Dr. Rafael Nogueira",  especialidade: "Implantodontia", avatar: "https://i.pravatar.cc/100?img=12", status: "ativo",  pacientes: 61 },
        { id: 3, nome: "Dra. Beatriz Lemos",   especialidade: "Endodontia",     avatar: "https://i.pravatar.cc/100?img=32", status: "ativo",  pacientes: 73 },
        { id: 4, nome: "Dr. Henrique Costa",   especialidade: "Clínico Geral",  avatar: "https://i.pravatar.cc/100?img=51", status: "ferias", pacientes: 45 },
    ],

    /* ------------------------------------------------------------------
       PACIENTES
       - status: ativo | inativo | pendente
    ------------------------------------------------------------------ */
    pacientes: [
        { id: 1, nome: "Marina Souza Alves",     cpf: "381.204.550-11", telefone: "(11) 99284-1120", email: "marina.alves@gmail.com",      convenio: "Amil Dental",       status: "ativo",    avatar: "https://i.pravatar.cc/100?img=5",  nascimento: "1994-03-12", ultimaVisita: "2026-07-18" },
        { id: 2, nome: "João Pedro Martins",     cpf: "204.117.884-02", telefone: "(11) 98123-7743", email: "jp.martins@outlook.com",      convenio: "Particular",       status: "ativo",    avatar: "https://i.pravatar.cc/100?img=13", nascimento: "1988-11-02", ultimaVisita: "2026-07-25" },
        { id: 3, nome: "Helena Duarte Ribeiro",  cpf: "115.902.330-90", telefone: "(11) 97711-2200", email: "helena.duarte@icloud.com",   convenio: "SulAmérica Odonto", status: "inativo",  avatar: "https://i.pravatar.cc/100?img=9",  nascimento: "1976-06-30", ultimaVisita: "2026-04-02" },
        { id: 4, nome: "Lucas Andrade Villa",   cpf: "552.887.410-55", telefone: "(11) 99001-6612", email: "lucas.villa@gmail.com",      convenio: "Particular",       status: "ativo",    avatar: "https://i.pravatar.cc/100?img=15", nascimento: "2001-01-19", ultimaVisita: "2026-07-29" },
        { id: 5, nome: "Sofia Nascimento Reis", cpf: "300.774.221-08", telefone: "(11) 98455-9981", email: "sofia.reis@gmail.com",       convenio: "Bradesco Dental",  status: "ativo",    avatar: "https://i.pravatar.cc/100?img=20", nascimento: "1999-09-08", ultimaVisita: "2026-07-30" },
        { id: 6, nome: "Fernando Melo Carvalho",cpf: "902.113.774-40", telefone: "(11) 97633-4410", email: "fernando.carvalho@hotmail.com", convenio: "Particular",     status: "pendente", avatar: "https://i.pravatar.cc/100?img=33", nascimento: "1983-05-22", ultimaVisita: "2026-06-11" },
        { id: 7, nome: "Isabela Cruz Fontes",   cpf: "441.220.998-73", telefone: "(11) 99887-2231", email: "isa.fontes@gmail.com",       convenio: "Amil Dental",       status: "ativo",    avatar: "https://i.pravatar.cc/100?img=25", nascimento: "1995-12-01", ultimaVisita: "2026-07-14" },
        { id: 8, nome: "Gabriel Teixeira Pinto",cpf: "670.334.112-29", telefone: "(11) 98221-0087", email: "gabriel.pinto@gmail.com",    convenio: "Particular",       status: "ativo",    avatar: "https://i.pravatar.cc/100?img=60", nascimento: "1990-08-14", ultimaVisita: "2026-07-27" },
    ],

    /* ------------------------------------------------------------------
       CONSULTAS (a agenda)
       - dia   : 1 = Segunda, 2 = Terça ... 7 = Domingo
       - status: confirmada | em-andamento | concluida | cancelada
    ------------------------------------------------------------------ */
    consultas: [
        { id: 1, paciente: "Marina Souza Alves",     dentista: "Dra. Camila Ferraz",  horario: "08:00", duracao: 60, dia: 1, procedimento: "Manutenção Ortodôntica", status: "confirmada"   },
        { id: 2, paciente: "João Pedro Martins",     dentista: "Dr. Rafael Nogueira", horario: "09:30", duracao: 90, dia: 1, procedimento: "Implante — Avaliação",     status: "em-andamento" },
        { id: 3, paciente: "Sofia Nascimento Reis",  dentista: "Dra. Beatriz Lemos",  horario: "11:00", duracao: 60, dia: 1, procedimento: "Canal",                   status: "confirmada"   },
        { id: 4, paciente: "Gabriel Teixeira Pinto", dentista: "Dra. Camila Ferraz",  horario: "14:00", duracao: 45, dia: 2, procedimento: "Limpeza",                 status: "confirmada"   },
        { id: 5, paciente: "Isabela Cruz Fontes",    dentista: "Dr. Henrique Costa",  horario: "15:00", duracao: 30, dia: 2, procedimento: "Avaliação",               status: "cancelada"    },
        { id: 6, paciente: "Lucas Andrade Villa",    dentista: "Dra. Beatriz Lemos",  horario: "10:00", duracao: 60, dia: 3, procedimento: "Extração",                status: "concluida"    },
        { id: 7, paciente: "Fernando Melo Carvalho", dentista: "Dr. Rafael Nogueira", horario: "16:30", duracao: 60, dia: 3, procedimento: "Implante",                status: "confirmada"   },
        { id: 8, paciente: "Marina Souza Alves",     dentista: "Dra. Camila Ferraz",  horario: "09:00", duracao: 45, dia: 4, procedimento: "Manutenção Ortodôntica", status: "confirmada"   },
        { id: 9, paciente: "Helena Duarte Ribeiro",  dentista: "Dra. Beatriz Lemos",  horario: "13:00", duracao: 60, dia: 5, procedimento: "Canal",                   status: "confirmada"   },
    ],

    /* ------------------------------------------------------------------
       PROCEDIMENTOS REALIZADOS
       - status: concluido | em-andamento | pendente | cancelado
    ------------------------------------------------------------------ */
    procedimentos: [
        { id: 1, paciente: "Marina Souza Alves",     dentista: "Dra. Camila Ferraz",  tipo: "Ortodontia", valor: 320,  data: "2026-07-18", status: "concluido"    },
        { id: 2, paciente: "João Pedro Martins",     dentista: "Dr. Rafael Nogueira", tipo: "Implante",   valor: 2400, data: "2026-07-25", status: "em-andamento" },
        { id: 3, paciente: "Sofia Nascimento Reis",  dentista: "Dra. Beatriz Lemos",  tipo: "Canal",      valor: 780,  data: "2026-07-30", status: "concluido"    },
        { id: 4, paciente: "Lucas Andrade Villa",    dentista: "Dra. Beatriz Lemos",  tipo: "Extração",   valor: 210,  data: "2026-07-29", status: "concluido"    },
        { id: 5, paciente: "Isabela Cruz Fontes",    dentista: "Dr. Henrique Costa",  tipo: "Limpeza",    valor: 150,  data: "2026-07-14", status: "concluido"    },
        { id: 6, paciente: "Fernando Melo Carvalho", dentista: "Dr. Rafael Nogueira", tipo: "Implante",   valor: 2400, data: "2026-06-11", status: "pendente"     },
        { id: 7, paciente: "Gabriel Teixeira Pinto", dentista: "Dra. Camila Ferraz",  tipo: "Ortodontia", valor: 320,  data: "2026-07-27", status: "concluido"    },
        { id: 8, paciente: "Helena Duarte Ribeiro",  dentista: "Dra. Beatriz Lemos",  tipo: "Canal",      valor: 780,  data: "2026-04-02", status: "cancelado"    },
    ],

    /* ------------------------------------------------------------------
       PAGAMENTOS (financeiro)
       - status: pago | pendente | atrasado
    ------------------------------------------------------------------ */
    pagamentos: [
        { id: 1, paciente: "Marina Souza Alves",     valor: 320,  metodo: "Cartão de Crédito", data: "2026-07-18", status: "pago" },
        { id: 2, paciente: "João Pedro Martins",     valor: 1200, metodo: "Pix",               data: "2026-07-25", status: "pago" },
        { id: 3, paciente: "Sofia Nascimento Reis",  valor: 780,  metodo: "Convênio",          data: "2026-07-30", status: "pago" },
        { id: 4, paciente: "Fernando Melo Carvalho", valor: 2400, metodo: "Boleto",            data: "2026-08-05", status: "pendente" },
        { id: 5, paciente: "Helena Duarte Ribeiro",  valor: 780,  metodo: "Cartão de Crédito", data: "2026-04-02", status: "atrasado" },
        { id: 6, paciente: "Gabriel Teixeira Pinto", valor: 320,  metodo: "Pix",               data: "2026-07-27", status: "pago" },
        { id: 7, paciente: "Isabela Cruz Fontes",    valor: 150,  metodo: "Dinheiro",          data: "2026-07-14", status: "pago" },
    ],

    /* ------------------------------------------------------------------
       GRÁFICOS (dados dos últimos 7 dias / do mês)
    ------------------------------------------------------------------ */
    visitasSemana: [18, 24, 21, 27, 30, 14, 8],
    receitaMes:    [12800, 14200, 13650, 16900, 18100, 17400, 21300],

    /* ------------------------------------------------------------------
       ATIVIDADES RECENTES (mostradas no Dashboard)
    ------------------------------------------------------------------ */
    atividades: [
        { icone: "ri-user-add-line",            texto: "Novo paciente cadastrado — Sofia Nascimento Reis", tempo: "há 12 min" },
        { icone: "ri-calendar-check-line",      texto: "Consulta confirmada com João Pedro Martins",       tempo: "há 40 min" },
        { icone: "ri-money-dollar-circle-line", texto: "Pagamento recebido — R$ 780,00",                   tempo: "há 1h" },
        { icone: "ri-tooth-line",               texto: "Procedimento registrado: Extração — Lucas Andrade", tempo: "há 2h" },
        { icone: "ri-close-circle-line",        texto: "Consulta cancelada — Isabela Cruz Fontes",         tempo: "há 3h" },
    ],
};

/* =====================================================================
   FUNÇÃO EXTRA: saber qual é o "paciente logado" na demonstração.
   Usamos o primeiro paciente da lista quando o perfil é "paciente".
   ===================================================================== */
function pacienteLogado() {
    return DADOS.pacientes[0];
}

/* =====================================================================
   FUNÇÃO EXTRA: pegar o usuário logado (DADOS.usuarios[perfil]).
   O perfil fica salvo no navegador pelo login (localStorage "ps-role").
   ===================================================================== */
function usuarioLogado() {
    const papel = localStorage.getItem('ps-role') || 'dentista'; // perfil padrão
    return DADOS.usuarios[papel];
}