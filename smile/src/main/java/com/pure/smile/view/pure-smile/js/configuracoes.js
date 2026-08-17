/* ===================================================================
   PURE SMILE — CONFIGURAÇÕES
=================================================================== */
document.addEventListener('DOMContentLoaded', ()=>{
  PSLayout.render('configuracoes.html', 'Configurações', 'Preferências e administração do sistema');

  const role = PSLayout.getRole();

  // Apenas administradores gerenciam usuários do sistema.
  if(role !== 'admin'){
    document.getElementById('navUsuarios').style.display = 'none';
  } else {
    const roleLabel = { dentista:'Dentista', funcionario:'Secretaria', admin:'Administrador' };
    document.getElementById('usersList').innerHTML = PS_DATA.dentists.map(d=>`
      <div class="user-row">
        <img src="${d.avatar}" alt="">
        <div style="flex:1;"><strong style="font-size:13px;">${d.name}</strong><div class="text-xs text-muted">${d.specialty}</div></div>
        <span class="badge badge-info">Dentista</span>
        ${statusBadge(d.status === 'ativo' ? 'ativo' : 'pendente')}
      </div>`).join('') + `
      <div class="user-row">
        <img src="https://i.pravatar.cc/100?img=44" alt="">
        <div style="flex:1;"><strong style="font-size:13px;">Ana Beatriz Lima</strong><div class="text-xs text-muted">Secretaria</div></div>
        <span class="badge badge-neutral">Funcionário</span>
        ${statusBadge('ativo')}
      </div>`;
  }

  document.querySelectorAll('.settings-nav-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      document.querySelectorAll('.settings-nav-item').forEach(i=>i.classList.remove('is-active'));
      document.querySelectorAll('.settings-panel').forEach(p=>p.classList.remove('is-active'));
      item.classList.add('is-active');
      document.querySelector(`.settings-panel[data-panel="${item.dataset.panel}"]`).classList.add('is-active');
    });
  });

  function syncSwatches(){
    const theme = document.documentElement.getAttribute('data-theme');
    document.getElementById('swatchLight').classList.toggle('is-active', theme !== 'dark');
    document.getElementById('swatchDark').classList.toggle('is-active', theme === 'dark');
  }
  document.getElementById('swatchLight').addEventListener('click', ()=>{
    if(document.documentElement.getAttribute('data-theme') === 'dark') PSTheme.toggle();
    syncSwatches();
  });
  document.getElementById('swatchDark').addEventListener('click', ()=>{
    if(document.documentElement.getAttribute('data-theme') !== 'dark') PSTheme.toggle();
    syncSwatches();
  });
  syncSwatches();

  if(typeof gsap !== 'undefined'){
    gsap.from('.settings-layout .card', { opacity:0, y:16, stagger:.1, duration:.5, ease:'power2.out' });
  }
});
