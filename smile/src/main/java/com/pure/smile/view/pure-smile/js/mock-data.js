/* ===================================================================
   PURE SMILE — MOCK DATA
   Simula o retorno que viria do back-end Java + MySQL via JDBC.
   Estrutura pensada para mapear 1:1 com futuras tabelas do banco.
=================================================================== */

const PS_DATA = {

  currentUser: {
    id: 1,
    name: "Dra. Camila Ferraz",
    role: "dentista", // paciente | dentista | funcionario | admin
    specialty: "Ortodontia",
    email: "camila.ferraz@puresmile.com",
    phone: "(11) 98211-3344",
    avatar: "https://i.pravatar.cc/150?img=47",
  },

  dentists: [
    { id: 1, name: "Dra. Camila Ferraz", specialty: "Ortodontia", avatar: "https://i.pravatar.cc/100?img=47", status: "ativo", patients: 84 },
    { id: 2, name: "Dr. Rafael Nogueira", specialty: "Implantodontia", avatar: "https://i.pravatar.cc/100?img=12", status: "ativo", patients: 61 },
    { id: 3, name: "Dra. Beatriz Lemos", specialty: "Endodontia", avatar: "https://i.pravatar.cc/100?img=32", status: "ativo", patients: 73 },
    { id: 4, name: "Dr. Henrique Costa", specialty: "Clínico Geral", avatar: "https://i.pravatar.cc/100?img=51", status: "férias", patients: 45 },
  ],

  patients: [
    { id: 1, name: "Marina Souza Alves", cpf: "381.204.550-11", phone: "(11) 99284-1120", email: "marina.alves@gmail.com", covenant: "Amil Dental", status: "ativo", avatar: "https://i.pravatar.cc/100?img=5", birth: "1994-03-12", lastVisit: "2026-07-18" },
    { id: 2, name: "João Pedro Martins", cpf: "204.117.884-02", phone: "(11) 98123-7743", email: "jp.martins@outlook.com", covenant: "Particular", status: "ativo", avatar: "https://i.pravatar.cc/100?img=13", birth: "1988-11-02", lastVisit: "2026-07-25" },
    { id: 3, name: "Helena Duarte Ribeiro", cpf: "115.902.330-90", phone: "(11) 97711-2200", email: "helena.duarte@icloud.com", covenant: "SulAmérica Odonto", status: "inativo", avatar: "https://i.pravatar.cc/100?img=9", birth: "1976-06-30", lastVisit: "2026-04-02" },
    { id: 4, name: "Lucas Andrade Villa", cpf: "552.887.410-55", phone: "(11) 99001-6612", email: "lucas.villa@gmail.com", covenant: "Particular", status: "ativo", avatar: "https://i.pravatar.cc/100?img=15", birth: "2001-01-19", lastVisit: "2026-07-29" },
    { id: 5, name: "Sofia Nascimento Reis", cpf: "300.774.221-08", phone: "(11) 98455-9981", email: "sofia.reis@gmail.com", covenant: "Bradesco Dental", status: "ativo", avatar: "https://i.pravatar.cc/100?img=20", birth: "1999-09-08", lastVisit: "2026-07-30" },
    { id: 6, name: "Fernando Melo Carvalho", cpf: "902.113.774-40", phone: "(11) 97633-4410", email: "fernando.carvalho@hotmail.com", covenant: "Particular", status: "pendente", avatar: "https://i.pravatar.cc/100?img=33", birth: "1983-05-22", lastVisit: "2026-06-11" },
    { id: 7, name: "Isabela Cruz Fontes", cpf: "441.220.998-73", phone: "(11) 99887-2231", email: "isa.fontes@gmail.com", covenant: "Amil Dental", status: "ativo", avatar: "https://i.pravatar.cc/100?img=25", birth: "1995-12-01", lastVisit: "2026-07-14" },
    { id: 8, name: "Gabriel Teixeira Pinto", cpf: "670.334.112-29", phone: "(11) 98221-0087", email: "gabriel.pinto@gmail.com", covenant: "Particular", status: "ativo", avatar: "https://i.pravatar.cc/100?img=60", birth: "1990-08-14", lastVisit: "2026-07-27" },
  ],

  appointments: [
    { id: 1, patient: "Marina Souza Alves", dentist: "Dra. Camila Ferraz", time: "08:00", duration: 60, day: 1, procedure: "Manutenção Ortodôntica", status: "confirmada" },
    { id: 2, patient: "João Pedro Martins", dentist: "Dr. Rafael Nogueira", time: "09:30", duration: 90, day: 1, procedure: "Implante — Avaliação", status: "em-andamento" },
    { id: 3, patient: "Sofia Nascimento Reis", dentist: "Dra. Beatriz Lemos", time: "11:00", duration: 60, day: 1, procedure: "Canal", status: "confirmada" },
    { id: 4, patient: "Gabriel Teixeira Pinto", dentist: "Dra. Camila Ferraz", time: "14:00", duration: 45, day: 2, procedure: "Limpeza", status: "confirmada" },
    { id: 5, patient: "Isabela Cruz Fontes", dentist: "Dr. Henrique Costa", time: "15:00", duration: 30, day: 2, procedure: "Avaliação", status: "cancelada" },
    { id: 6, patient: "Lucas Andrade Villa", dentist: "Dra. Beatriz Lemos", time: "10:00", duration: 60, day: 3, procedure: "Extração", status: "concluida" },
    { id: 7, patient: "Fernando Melo Carvalho", dentist: "Dr. Rafael Nogueira", time: "16:30", duration: 60, day: 3, procedure: "Implante", status: "confirmada" },
    { id: 8, patient: "Marina Souza Alves", dentist: "Dra. Camila Ferraz", time: "09:00", duration: 45, day: 4, procedure: "Manutenção Ortodôntica", status: "confirmada" },
    { id: 9, patient: "Helena Duarte Ribeiro", dentist: "Dra. Beatriz Lemos", time: "13:00", duration: 60, day: 5, procedure: "Canal", status: "confirmada" },
  ],

  procedures: [
    { id: 1, patient: "Marina Souza Alves", dentist: "Dra. Camila Ferraz", type: "Ortodontia", value: 320, date: "2026-07-18", status: "concluido" },
    { id: 2, patient: "João Pedro Martins", dentist: "Dr. Rafael Nogueira", type: "Implante", value: 2400, date: "2026-07-25", status: "em-andamento" },
    { id: 3, patient: "Sofia Nascimento Reis", dentist: "Dra. Beatriz Lemos", type: "Canal", value: 780, date: "2026-07-30", status: "concluido" },
    { id: 4, patient: "Lucas Andrade Villa", dentist: "Dra. Beatriz Lemos", type: "Extração", value: 210, date: "2026-07-29", status: "concluido" },
    { id: 5, patient: "Isabela Cruz Fontes", dentist: "Dr. Henrique Costa", type: "Limpeza", value: 150, date: "2026-07-14", status: "concluido" },
    { id: 6, patient: "Fernando Melo Carvalho", dentist: "Dr. Rafael Nogueira", type: "Implante", value: 2400, date: "2026-06-11", status: "pendente" },
    { id: 7, patient: "Gabriel Teixeira Pinto", dentist: "Dra. Camila Ferraz", type: "Ortodontia", value: 320, date: "2026-07-27", status: "concluido" },
    { id: 8, patient: "Helena Duarte Ribeiro", dentist: "Dra. Beatriz Lemos", type: "Canal", value: 780, date: "2026-04-02", status: "cancelado" },
  ],

  payments: [
    { id: 1, patient: "Marina Souza Alves", value: 320, method: "Cartão de Crédito", date: "2026-07-18", status: "pago" },
    { id: 2, patient: "João Pedro Martins", value: 1200, method: "Pix", date: "2026-07-25", status: "pago" },
    { id: 3, patient: "Sofia Nascimento Reis", value: 780, method: "Convênio", date: "2026-07-30", status: "pago" },
    { id: 4, patient: "Fernando Melo Carvalho", value: 2400, method: "Boleto", date: "2026-08-05", status: "pendente" },
    { id: 5, patient: "Helena Duarte Ribeiro", value: 780, method: "Cartão de Crédito", date: "2026-04-02", status: "atrasado" },
    { id: 6, patient: "Gabriel Teixeira Pinto", value: 320, method: "Pix", date: "2026-07-27", status: "pago" },
    { id: 7, patient: "Isabela Cruz Fontes", value: 150, method: "Dinheiro", date: "2026-07-14", status: "pago" },
  ],

  weeklyVisits: [18, 24, 21, 27, 30, 14, 8],
  monthlyRevenue: [12800, 14200, 13650, 16900, 18100, 17400, 21300],

  activities: [
    { icon: "ri-user-add-line", text: "Novo paciente cadastrado — Sofia Nascimento Reis", time: "há 12 min" },
    { icon: "ri-calendar-check-line", text: "Consulta confirmada com João Pedro Martins", time: "há 40 min" },
    { icon: "ri-money-dollar-circle-line", text: "Pagamento recebido — R$ 780,00", time: "há 1h" },
    { icon: "ri-tooth-line", text: "Procedimento registrado: Extração — Lucas Andrade", time: "há 2h" },
    { icon: "ri-close-circle-line", text: "Consulta cancelada — Isabela Cruz Fontes", time: "há 3h" },
  ],
};
