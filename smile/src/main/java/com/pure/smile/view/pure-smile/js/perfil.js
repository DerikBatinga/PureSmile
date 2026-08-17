/* ===================================================================
   PURE SMILE — PERFIL
=================================================================== */
document.addEventListener('DOMContentLoaded', ()=>{
  PSLayout.render('perfil.html', 'Meu perfil', 'Gerencie seus dados e preferências');

  const role = PSLayout.getRole();
  const user = PSLayout.getUser();
  const roleLabels = { dentista:'Dentista', funcionario:'Secretaria', admin:'Administrador', paciente:'Paciente' };

  const extraInfo = {
    dentista: { email:'camila.ferraz@puresmile.com', phone:'(11) 98211-3344', extra: 'Ortodontia' },
    funcionario: { email:'ana.lima@puresmile.com', phone:'(11) 97744-2200', extra: 'Recepção e Cadastros' },
    admin: { email:'rodrigo.fialho@puresmile.com', phone:'(11) 99022-1188', extra: 'Administração Geral' },
    paciente: { email:'marina.alves@gmail.com', phone:'(11) 99284-1120', extra: 'Amil Dental' },
  }[role];

  document.getElementById('profileSideCard').innerHTML = `
    <img src="${user.avatar}" alt="">
    <h3>${user.name}</h3>
    <p>${extraInfo.extra}</p>
    <span class="badge badge-info profile-tag"><i class="ri-shield-user-line"></i>${roleLabels[role]}</span>
    <div class="profile-stats">
      ${role === 'paciente' ? `
        <div><strong>${PS_DATA.procedures.filter(p=>p.patient===PS_DATA.patients[0].name).length}</strong><span>Procedimentos</span></div>
        <div><strong>${PS_DATA.appointments.filter(a=>a.patient===PS_DATA.patients[0].name).length}</strong><span>Consultas</span></div>
      ` : `
        <div><strong>${PS_DATA.patients.length}</strong><span>Pacientes</span></div>
        <div><strong>${PS_DATA.appointments.length}</strong><span>Consultas</span></div>
      `}
    </div>
  `;

  document.getElementById('formEditar').innerHTML = `
    <div class="field span-2"><label>Nome completo</label><input class="input" value="${user.name}"></div>
    <div class="field"><label>E-mail</label><input class="input" type="email" value="${extraInfo.email}"></div>
    <div class="field"><label>Telefone</label><input class="input" value="${extraInfo.phone}"></div>
    ${role !== 'paciente' ? `<div class="field span-2"><label>Especialidade / Cargo</label><input class="input" value="${extraInfo.extra}"></div>` : `<div class="field span-2"><label>Convênio</label><input class="input" value="${extraInfo.extra}"></div>`}
  `;

  document.querySelectorAll('.profile-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.profile-tab').forEach(t=>t.classList.remove('is-active'));
      document.querySelectorAll('.profile-panel').forEach(p=>p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.querySelector(`.profile-panel[data-panel="${tab.dataset.tab}"]`).classList.add('is-active');
    });
  });

  document.getElementById('btnSaveProfile').addEventListener('click', ()=>{
    PSToast('Suas informações foram atualizadas.', 'success', 'Perfil atualizado');
  });
  document.getElementById('btnChangePassword').addEventListener('click', ()=>{
    PSToast('Sua senha foi alterada com sucesso.', 'success', 'Senha atualizada');
  });

  if(typeof gsap !== 'undefined'){
    gsap.from('.profile-layout .card', { opacity:0, y:16, stagger:.1, duration:.5, ease:'power2.out' });
  }
});
