/* ===================================================================
   PURE SMILE — DETALHES DO PACIENTE
=================================================================== */
document.addEventListener('DOMContentLoaded', ()=>{
  PSLayout.render('pacientes.html', 'Detalhes do paciente', 'Dados completos e histórico clínico');

  const id = parseInt(new URLSearchParams(location.search).get('id')) || 1;
  const patient = PS_DATA.patients.find(p=>p.id===id) || PS_DATA.patients[0];
  const appointments = PS_DATA.appointments.filter(a=>a.patient===patient.name);
  const procedures = PS_DATA.procedures.filter(p=>p.patient===patient.name);
  const payments = PS_DATA.payments.filter(p=>p.patient===patient.name);

  document.getElementById('profileHead').innerHTML = `
    <img src="${patient.avatar}" alt="">
    <div>
      <h2>${patient.name}</h2>
      <div class="meta-row">
        <span><i class="ri-bank-card-line"></i> ${patient.cpf}</span>
        <span><i class="ri-phone-line"></i> ${patient.phone}</span>
        <span><i class="ri-mail-line"></i> ${patient.email}</span>
        ${statusBadgeSafe(patient.status)}
      </div>
    </div>
    <button class="btn btn-secondary" style="margin-left:auto;" onclick="PSToast('Edição de cadastro ainda não implementada nesta demo.','info')"><i class="ri-edit-line"></i> Editar cadastro</button>
  `;

  document.getElementById('panelDados').innerHTML = `
    <div class="info-grid">
      <div class="info-item"><label>Nome completo</label><strong>${patient.name}</strong></div>
      <div class="info-item"><label>Data de nascimento</label><strong>${new Date(patient.birth).toLocaleDateString('pt-BR')}</strong></div>
      <div class="info-item"><label>CPF</label><strong>${patient.cpf}</strong></div>
      <div class="info-item"><label>Telefone</label><strong>${patient.phone}</strong></div>
      <div class="info-item"><label>E-mail</label><strong>${patient.email}</strong></div>
      <div class="info-item"><label>Convênio</label><strong>${patient.covenant}</strong></div>
      <div class="info-item"><label>Última visita</label><strong>${new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</strong></div>
      <div class="info-item"><label>Status</label><strong>${statusBadgeSafe(patient.status)}</strong></div>
    </div>
  `;

  document.getElementById('panelConsultas').innerHTML = appointments.length ? appointments.map(a=>`
    <div class="timeline-item">
      <div class="timeline-dot"><i class="ri-calendar-2-line"></i></div>
      <div>
        <strong>${a.procedure}</strong> — ${a.dentist}
        <div class="text-sm text-muted">Dia ${a.day} · ${a.time} · ${statusBadge(a.status)}</div>
      </div>
    </div>`).join('') : emptyPanel('Sem consultas registradas', 'Este paciente ainda não possui consultas no histórico.');

  document.getElementById('panelProcedimentos').innerHTML = procedures.length ? procedures.map(p=>`
    <div class="timeline-item">
      <div class="timeline-dot"><i class="ri-tooth-line"></i></div>
      <div>
        <strong>${p.type}</strong> — ${p.dentist}
        <div class="text-sm text-muted">${new Date(p.date).toLocaleDateString('pt-BR')} · ${psCurrency(p.value)} · ${statusBadge(p.status)}</div>
      </div>
    </div>`).join('') : emptyPanel('Sem procedimentos registrados', 'Nenhum procedimento foi realizado até o momento.');

  document.getElementById('panelFinanceiro').innerHTML = payments.length ? payments.map(p=>`
    <div class="timeline-item">
      <div class="timeline-dot"><i class="ri-money-dollar-circle-line"></i></div>
      <div>
        <strong>${psCurrency(p.value)}</strong> — ${p.method}
        <div class="text-sm text-muted">${new Date(p.date).toLocaleDateString('pt-BR')} · ${statusBadge(p.status)}</div>
      </div>
    </div>`).join('') : emptyPanel('Sem histórico financeiro', 'Nenhum pagamento foi registrado para este paciente.');

  document.querySelectorAll('.detail-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.detail-tab').forEach(t=>t.classList.remove('is-active'));
      document.querySelectorAll('.detail-panel').forEach(p=>p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.querySelector(`.detail-panel[data-panel="${tab.dataset.tab}"]`).classList.add('is-active');
    });
  });

  if(typeof gsap !== 'undefined'){
    gsap.from('.content .card', { opacity:0, y:16, duration:.5, ease:'power2.out' });
  }
});

function emptyPanel(title, msg){
  return `<div class="empty-state">
    <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" delay="2000" colors="primary:#5e81ac,secondary:#394e6e" style="width:88px;height:88px"></lord-icon>
    <h4>${title}</h4><p>${msg}</p>
  </div>`;
}
