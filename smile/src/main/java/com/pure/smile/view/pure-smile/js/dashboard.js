/* ===================================================================
   PURE SMILE — DASHBOARD LOGIC
   (funções utilitárias psCurrency/statusBadge vêm de js/common.js)
=================================================================== */
function quickActionsBlock(){
  return `
    <div class="card card-pad">
      <div class="section-title"><h3>Ações rápidas</h3></div>
      <div class="quick-actions">
        <div class="quick-action" onclick="location.href='pacientes.html?new=1'"><i class="ri-user-add-line"></i><span>Novo Paciente</span></div>
        <div class="quick-action" onclick="PSToast('Cadastro de dentista disponível no módulo Configurações.', 'info')"><i class="ri-stethoscope-line"></i><span>Novo Dentista</span></div>
        <div class="quick-action" onclick="location.href='agenda.html?new=1'"><i class="ri-calendar-event-line"></i><span>Nova Consulta</span></div>
        <div class="quick-action" onclick="location.href='procedimentos.html?new=1'"><i class="ri-tooth-line"></i><span>Novo Procedimento</span></div>
      </div>
    </div>`;
}

function upcomingAppointmentsBlock(list){
  if(!list.length){
    return `<div class="card card-pad"><div class="section-title"><h3>Próximas consultas</h3></div>
      <div class="empty-state">
        <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" delay="2000" colors="primary:#5e81ac,secondary:#394e6e" style="width:88px;height:88px"></lord-icon>
        <h4>Nenhuma consulta agendada</h4>
        <p>Quando novas consultas forem marcadas, elas aparecem aqui.</p>
      </div></div>`;
  }
  return `
    <div class="card card-pad">
      <div class="section-title"><h3>Próximas consultas</h3><a href="agenda.html" class="btn btn-ghost btn-sm">Ver agenda</a></div>
      ${list.map(a => `
        <div class="list-row">
          <img src="https://i.pravatar.cc/100?u=${encodeURIComponent(a.patient)}" alt="">
          <div class="meta"><strong>${a.patient}</strong><span>${a.procedure} · ${a.dentist}</span></div>
          <div class="time">${a.time}</div>
        </div>`).join('')}
    </div>`;
}

function recentPatientsBlock(list){
  return `
    <div class="card card-pad">
      <div class="section-title"><h3>Últimos pacientes cadastrados</h3><a href="pacientes.html" class="btn btn-ghost btn-sm">Ver todos</a></div>
      ${list.map(p => `
        <div class="list-row">
          <img src="${p.avatar}" alt="">
          <div class="meta"><strong>${p.name}</strong><span>${p.covenant}</span></div>
          ${statusBadge(p.status)}
        </div>`).join('')}
    </div>`;
}

function activitiesBlock(){
  return `
    <div class="card card-pad">
      <div class="section-title"><h3>Atividades recentes</h3></div>
      ${PS_DATA.activities.map(a => `
        <div class="activity-row">
          <i class="${a.icon}"></i>
          <div><p>${a.text}</p><span>${a.time}</span></div>
        </div>`).join('')}
    </div>`;
}

/* ------------------------- MONTAGEM POR PERFIL ------------------------- */

function renderDashboardStaff(role){
  const activePatients = PS_DATA.patients.filter(p=>p.status==='ativo').length;
  const todays = PS_DATA.appointments.filter(a=>a.day===1);
  const activeDentists = PS_DATA.dentists.filter(d=>d.status==='ativo').length;
  const monthlyRevenue = PS_DATA.monthlyRevenue.reduce((a,b)=>a+b,0);

  document.getElementById('dashboardContent').innerHTML = `
    <div class="dash-grid">
      ${buildStatCard('ri-group-line', 'var(--primary-soft)', 'var(--primary)', activePatients, 'Pacientes ativos', '8%', 'up')}
      ${buildStatCard('ri-calendar-check-line', 'var(--accent-soft)', 'var(--accent)', todays.length, 'Consultas hoje', '3%', 'up')}
      ${buildStatCard('ri-stethoscope-line', 'var(--success-soft)', '#2E8A44', activeDentists, 'Dentistas ativos', '0%', 'up')}
      ${buildStatCard('ri-money-dollar-circle-line', 'var(--warning-soft)', '#B36A00', psCurrency(monthlyRevenue).replace(',00',''), 'Receita mensal', '12%', 'up')}
    </div>

    <div class="dash-main">
      <div class="flex" style="flex-direction:column; gap:var(--sp-5);">
        <div class="card card-pad">
          <div class="section-title">
            <h3>Visão semanal de atendimentos</h3>
            <div class="chart-tabs">
              <button class="is-active">Semana</button>
              <button>Mês</button>
            </div>
          </div>
          ${buildBarsChart(PS_DATA.weeklyVisits, ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'])}
        </div>
        <div class="card card-pad">
          <div class="section-title"><h3>Receita — últimos 7 dias</h3><span class="badge badge-success"><i class="ri-arrow-up-line"></i>+12,4%</span></div>
          ${buildBarsChart(PS_DATA.monthlyRevenue, ['24/07','25/07','26/07','27/07','28/07','29/07','30/07'], 'R$ ')}
        </div>
        ${recentPatientsBlock(PS_DATA.patients.slice(0,4))}
      </div>

      <div class="flex" style="flex-direction:column; gap:var(--sp-5);">
        ${quickActionsBlock()}
        ${upcomingAppointmentsBlock(todays)}
        ${activitiesBlock()}
      </div>
    </div>
  `;
}

function renderDashboardPaciente(){
  const user = PS_DATA.patients[0]; // Marina Souza Alves — paciente demo
  const myAppointments = PS_DATA.appointments.filter(a=>a.patient===user.name);
  const myProcedures = PS_DATA.procedures.filter(p=>p.patient===user.name);
  const myPayments = PS_DATA.payments.filter(p=>p.patient===user.name);
  const nextAppt = myAppointments[0];
  const pendingPayment = myPayments.find(p=>p.status!=='pago');

  document.getElementById('dashboardContent').innerHTML = `
    <div class="card card-pad card-glass mb-6" style="background:linear-gradient(120deg, var(--primary-soft), transparent);">
      <div class="flex items-center gap-4">
        <img src="${user.avatar}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;">
        <div>
          <h3 style="font-size:var(--fs-lg);">Olá, ${user.name.split(' ')[0]} 👋</h3>
          <p class="text-muted text-sm">Bem-vinda de volta ao seu espaço Pure Smile.</p>
        </div>
      </div>
    </div>

    <div class="dash-grid">
      ${buildStatCard('ri-calendar-event-line', 'var(--primary-soft)', 'var(--primary)', nextAppt ? nextAppt.time : '—', nextAppt ? `Próxima consulta (${nextAppt.procedure})` : 'Nenhuma consulta agendada', '', 'up')}
      ${buildStatCard('ri-tooth-line', 'var(--accent-soft)', 'var(--accent)', myProcedures.length, 'Procedimentos realizados', '', 'up')}
      ${buildStatCard('ri-file-list-3-line', 'var(--warning-soft)', '#B36A00', pendingPayment ? psCurrency(pendingPayment.value) : psCurrency(0), 'Pendência financeira', '', pendingPayment ? 'down' : 'up')}
      ${buildStatCard('ri-shield-check-line', 'var(--success-soft)', '#2E8A44', 'Em dia', 'Situação cadastral', '', 'up')}
    </div>

    <div class="dash-main">
      <div class="flex" style="flex-direction:column; gap:var(--sp-5);">
        ${upcomingAppointmentsBlock(myAppointments)}
        <div class="card card-pad">
          <div class="section-title"><h3>Meus procedimentos recentes</h3><a href="procedimentos.html" class="btn btn-ghost btn-sm">Ver todos</a></div>
          ${myProcedures.map(p=>`
            <div class="list-row">
              <div class="stat-card__icon" style="width:34px;height:34px;font-size:15px;background:var(--accent-soft);color:var(--accent);"><i class="ri-tooth-line"></i></div>
              <div class="meta"><strong>${p.type}</strong><span>${p.dentist} · ${new Date(p.date).toLocaleDateString('pt-BR')}</span></div>
              ${statusBadge(p.status)}
            </div>`).join('') || '<p class="text-muted text-sm">Nenhum procedimento registrado ainda.</p>'}
        </div>
      </div>
      <div class="flex" style="flex-direction:column; gap:var(--sp-5);">
        <div class="card card-pad">
          <div class="section-title"><h3>Informações da clínica</h3></div>
          <div class="list-row"><i class="ri-map-pin-line text-muted" style="font-size:18px;"></i><div class="meta"><strong>Endereço</strong><span>Av. Faria Lima, 1200 — São Paulo/SP</span></div></div>
          <div class="list-row"><i class="ri-time-line text-muted" style="font-size:18px;"></i><div class="meta"><strong>Horário</strong><span>Seg a Sex, 08h às 19h</span></div></div>
          <div class="list-row"><i class="ri-phone-line text-muted" style="font-size:18px;"></i><div class="meta"><strong>Telefone</strong><span>(11) 4002-8899</span></div></div>
        </div>
        <div class="card card-pad">
          <div class="section-title"><h3>Ações</h3></div>
          <div class="quick-actions">
            <div class="quick-action" onclick="location.href='agenda.html'"><i class="ri-calendar-event-line"></i><span>Ver agenda</span></div>
            <div class="quick-action" onclick="location.href='pagamentos.html'"><i class="ri-bank-card-line"></i><span>Financeiro</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const role = PSLayout.getRole();
  const titles = {
    dentista: ['Dashboard', 'Visão geral dos seus atendimentos'],
    funcionario: ['Dashboard', 'Visão geral da operação da clínica'],
    admin: ['Dashboard', 'Visão geral administrativa da clínica'],
    paciente: ['Início', 'Seu espaço pessoal Pure Smile'],
  };
  const [title, crumb] = titles[role] || titles.dentista;
  PSLayout.render('dashboard.html', title, crumb);

  if(role === 'paciente') renderDashboardPaciente();
  else renderDashboardStaff(role);

  if(typeof gsap !== 'undefined'){
    gsap.from('.dash-grid .stat-card', { opacity:0, y:16, stagger:.08, duration:.5, ease:'power2.out', delay:.1 });
    gsap.from('.dash-main .card', { opacity:0, y:16, stagger:.08, duration:.5, ease:'power2.out', delay:.3 });
    gsap.from('.bars .bar', { height:0, stagger:.05, duration:.7, ease:'power2.out', delay:.5 });
  }
});
