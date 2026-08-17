/* ===================================================================
   PURE SMILE — PROCEDIMENTOS
=================================================================== */
const PROC_ICONS = {
  'Limpeza':'ri-sparkling-2-line', 'Canal':'ri-syringe-line', 'Extração':'ri-scissors-cut-line',
  'Ortodontia':'ri-magic-line', 'Implante':'ri-tools-line',
};

let procFilterType = 'todos';

function proceduresScoped(){
  const role = PSLayout.getRole();
  if(role === 'paciente') return PS_DATA.procedures.filter(p=>p.patient === PS_DATA.patients[0].name);
  return PS_DATA.procedures;
}

function renderProcedureStats(){
  const list = proceduresScoped();
  const total = list.reduce((a,p)=>a+p.value,0);
  const concluded = list.filter(p=>p.status==='concluido').length;
  const pending = list.filter(p=>p.status==='pendente' || p.status==='em-andamento').length;
  document.getElementById('procStats').innerHTML = `
    ${buildStatCard('ri-tooth-line','var(--primary-soft)','var(--primary)', list.length, 'Procedimentos no total', '', 'up')}
    ${buildStatCard('ri-checkbox-circle-line','var(--success-soft)','#2E8A44', concluded, 'Concluídos', '', 'up')}
    ${buildStatCard('ri-time-line','var(--warning-soft)','#B36A00', pending, 'Em andamento / pendentes', '', 'up')}
    ${buildStatCard('ri-money-dollar-circle-line','var(--accent-soft)','var(--accent)', psCurrency(total), 'Valor total', '', 'up')}
  `;
}

function renderProceduresTable(){
  let list = proceduresScoped();
  if(procFilterType !== 'todos') list = list.filter(p=>p.type === procFilterType);

  const tbody = document.getElementById('procTbody');
  const empty = document.getElementById('procEmpty');
  if(!list.length){
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = list.map(p=>`
    <tr>
      <td>${p.patient}</td>
      <td>${p.dentist}</td>
      <td><div class="flex items-center gap-3"><div class="proc-type-icon"><i class="${PROC_ICONS[p.type] || 'ri-tooth-line'}"></i></div>${p.type}</div></td>
      <td>${psCurrency(p.value)}</td>
      <td>${psFormatDate(p.date)}</td>
      <td>${statusBadge(p.status)}</td>
    </tr>`).join('');
}

document.addEventListener('DOMContentLoaded', ()=>{
  const role = PSLayout.getRole();
  const titles = { paciente: ['Meus Procedimentos', 'Histórico de procedimentos realizados'] };
  const [title, crumb] = titles[role] || ['Procedimentos', 'Registro e acompanhamento de procedimentos realizados'];
  PSLayout.render('procedimentos.html', title, crumb);

  renderProcedureStats();
  renderProceduresTable();

  document.querySelectorAll('#procFilters .filter-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      document.querySelectorAll('#procFilters .filter-chip').forEach(c=>c.classList.remove('is-active'));
      chip.classList.add('is-active');
      procFilterType = chip.dataset.type;
      renderProceduresTable();
    });
  });

  const patientSelect = document.getElementById('procPatient');
  const dentistSelect = document.getElementById('procDentist');
  patientSelect.innerHTML = PS_DATA.patients.map(p=>`<option>${p.name}</option>`).join('');
  dentistSelect.innerHTML = PS_DATA.dentists.map(d=>`<option>${d.name}</option>`).join('');
  document.getElementById('procDate').value = new Date().toISOString().slice(0,10);

  const btnNew = document.getElementById('btnNewProcedure');
  if(role === 'paciente'){ btnNew.style.display = 'none'; }
  btnNew.addEventListener('click', ()=> openModal('modalNewProcedure'));
  document.querySelectorAll('[data-close-modal]').forEach(b=> b.addEventListener('click', ()=> closeModal('modalNewProcedure')));

  document.getElementById('btnSaveProcedure').addEventListener('click', ()=>{
    closeModal('modalNewProcedure');
    PSToast('Procedimento registrado no histórico do paciente.', 'success', 'Registrado com sucesso');
  });

  if(new URLSearchParams(location.search).get('new') === '1') openModal('modalNewProcedure');

  if(typeof gsap !== 'undefined'){
    gsap.from('#procStats .stat-card', { opacity:0, y:16, stagger:.08, duration:.5, ease:'power2.out' });
    gsap.from('.content .card', { opacity:0, y:16, duration:.5, delay:.2, ease:'power2.out' });
  }
});
