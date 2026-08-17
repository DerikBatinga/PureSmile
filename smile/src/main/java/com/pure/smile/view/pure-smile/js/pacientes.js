/* ===================================================================
   PURE SMILE — PACIENTES
=================================================================== */
let psPatientsState = {
  search: '',
  status: 'todos',
  sortKey: 'name',
  sortDir: 'asc',
  page: 1,
  perPage: 5,
};

function psFilteredPatients(){
  let list = [...PS_DATA.patients];
  if(psPatientsState.status !== 'todos'){
    list = list.filter(p => p.status === psPatientsState.status);
  }
  if(psPatientsState.search.trim()){
    const q = psPatientsState.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.cpf.includes(q));
  }
  list.sort((a,b)=>{
    const dir = psPatientsState.sortDir === 'asc' ? 1 : -1;
    return a[psPatientsState.sortKey] > b[psPatientsState.sortKey] ? dir : -dir;
  });
  return list;
}

function renderPatientsTable(){
  const all = psFilteredPatients();
  const totalPages = Math.max(1, Math.ceil(all.length / psPatientsState.perPage));
  psPatientsState.page = Math.min(psPatientsState.page, totalPages);
  const start = (psPatientsState.page - 1) * psPatientsState.perPage;
  const pageItems = all.slice(start, start + psPatientsState.perPage);

  const tbody = document.getElementById('patientsTbody');
  const emptyEl = document.getElementById('patientsEmpty');

  if(!pageItems.length){
    tbody.innerHTML = '';
    emptyEl.style.display = 'block';
  } else {
    emptyEl.style.display = 'none';
    tbody.innerHTML = pageItems.map(p => `
      <tr onclick="location.href='paciente-detalhes.html?id=${p.id}'">
        <td>
          <div class="table-avatar">
            <img src="${p.avatar}" alt="">
            <div><div class="name">${p.name}</div><div class="sub">Última visita: ${new Date(p.lastVisit).toLocaleDateString('pt-BR')}</div></div>
          </div>
        </td>
        <td>${p.cpf}</td>
        <td>${p.phone}</td>
        <td>${p.covenant}</td>
        <td>${statusBadgeSafe(p.status)}</td>
        <td>
          <div class="row-actions">
            <button class="icon-btn" style="width:32px;height:32px;" data-tooltip="Ver detalhes" onclick="event.stopPropagation(); location.href='paciente-detalhes.html?id=${p.id}'"><i class="ri-eye-line"></i></button>
            <button class="icon-btn" style="width:32px;height:32px;" data-tooltip="Editar" onclick="event.stopPropagation(); PSToast('Edição rápida ainda não implementada nesta demo.','info')"><i class="ri-edit-line"></i></button>
          </div>
        </td>
      </tr>`).join('');
  }

  document.getElementById('paginationInfo').textContent =
    all.length ? `Mostrando ${start+1}–${Math.min(start+psPatientsState.perPage, all.length)} de ${all.length} pacientes` : 'Nenhum resultado';

  const pagesEl = document.getElementById('paginationPages');
  let pagesHtml = `<button class="page-btn" ${psPatientsState.page===1?'disabled':''} data-page="prev"><i class="ri-arrow-left-s-line"></i></button>`;
  for(let i=1;i<=totalPages;i++){
    pagesHtml += `<button class="page-btn ${i===psPatientsState.page?'is-active':''}" data-page="${i}">${i}</button>`;
  }
  pagesHtml += `<button class="page-btn" ${psPatientsState.page===totalPages?'disabled':''} data-page="next"><i class="ri-arrow-right-s-line"></i></button>`;
  pagesEl.innerHTML = pagesHtml;

  pagesEl.querySelectorAll('.page-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(btn.dataset.page === 'prev') psPatientsState.page--;
      else if(btn.dataset.page === 'next') psPatientsState.page++;
      else psPatientsState.page = parseInt(btn.dataset.page);
      renderPatientsTable();
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  const role = PSLayout.getRole();
  PSLayout.render('pacientes.html', 'Pacientes', 'Gerencie o cadastro e histórico dos pacientes');

  renderPatientsTable();

  document.getElementById('patientSearch').addEventListener('input', (e)=>{
    psPatientsState.search = e.target.value;
    psPatientsState.page = 1;
    renderPatientsTable();
  });

  document.querySelectorAll('.filter-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('is-active'));
      chip.classList.add('is-active');
      psPatientsState.status = chip.dataset.status;
      psPatientsState.page = 1;
      renderPatientsTable();
    });
  });

  document.querySelectorAll('[data-sort]').forEach(th=>{
    th.addEventListener('click', ()=>{
      const key = th.dataset.sort;
      if(psPatientsState.sortKey === key){
        psPatientsState.sortDir = psPatientsState.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        psPatientsState.sortKey = key;
        psPatientsState.sortDir = 'asc';
      }
      renderPatientsTable();
    });
  });

  document.getElementById('btnClearFilters').addEventListener('click', ()=>{
    psPatientsState = { search:'', status:'todos', sortKey:'name', sortDir:'asc', page:1, perPage:5 };
    document.getElementById('patientSearch').value = '';
    document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('is-active'));
    document.querySelector('.filter-chip[data-status="todos"]').classList.add('is-active');
    renderPatientsTable();
  });

  document.getElementById('btnNewPatient').addEventListener('click', ()=> openModal('modalNewPatient'));
  document.querySelectorAll('[data-close-modal]').forEach(btn=>{
    btn.addEventListener('click', ()=> closeModal('modalNewPatient'));
  });
  document.getElementById('modalNewPatient').addEventListener('click', (e)=>{
    if(e.target.id === 'modalNewPatient') closeModal('modalNewPatient');
  });

  document.getElementById('btnSavePatient').addEventListener('click', ()=>{
    const form = document.getElementById('formNewPatient');
    if(!form.checkValidity()){ form.reportValidity(); return; }
    closeModal('modalNewPatient');
    PSToast('Paciente cadastrado com sucesso.', 'success', 'Cadastro realizado');
    form.reset();
  });

  if(new URLSearchParams(location.search).get('new') === '1'){
    openModal('modalNewPatient');
  }

  if(typeof gsap !== 'undefined'){
    gsap.from('.content .card', { opacity:0, y:16, duration:.5, ease:'power2.out' });
  }
});
