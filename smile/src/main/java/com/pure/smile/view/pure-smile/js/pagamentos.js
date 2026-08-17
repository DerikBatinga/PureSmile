/* ===================================================================
   PURE SMILE — PAGAMENTOS
=================================================================== */
let payFilterStatus = 'todos';

function paymentsScoped(){
  const role = PSLayout.getRole();
  if(role === 'paciente') return PS_DATA.payments.filter(p=>p.patient === PS_DATA.patients[0].name);
  return PS_DATA.payments;
}

function renderPayStats(){
  const list = paymentsScoped();
  const total = list.reduce((a,p)=>a+p.value,0);
  const monthRevenue = PS_DATA.monthlyRevenue.reduce((a,b)=>a+b,0);
  const pending = list.filter(p=>p.status!=='pago').reduce((a,p)=>a+p.value,0);
  const received = list.filter(p=>p.status==='pago').reduce((a,p)=>a+p.value,0);

  document.getElementById('payStats').innerHTML = `
    ${buildStatCard('ri-safe-2-line','var(--primary-soft)','var(--primary)', psCurrency(total), 'Receita total', '5%', 'up')}
    ${buildStatCard('ri-calendar-2-line','var(--accent-soft)','var(--accent)', psCurrency(monthRevenue), 'Receita do mês', '12%', 'up')}
    ${buildStatCard('ri-alert-line','var(--warning-soft)','#B36A00', psCurrency(pending), 'Pendências', '2%', 'down')}
    ${buildStatCard('ri-checkbox-circle-line','var(--success-soft)','#2E8A44', psCurrency(received), 'Pagamentos recebidos', '9%', 'up')}
  `;
}

function renderPayChart(){
  document.getElementById('payChart').innerHTML = buildBarsChart(
    PS_DATA.monthlyRevenue, ['24/07','25/07','26/07','27/07','28/07','29/07','30/07'], 'R$ '
  );
}

function renderPayTable(){
  let list = paymentsScoped();
  if(payFilterStatus !== 'todos') list = list.filter(p=>p.status===payFilterStatus);
  document.getElementById('payTbody').innerHTML = list.length ? list.map(p=>`
    <tr>
      <td>${p.patient}</td>
      <td>${psCurrency(p.value)}</td>
      <td>${p.method}</td>
      <td>${psFormatDate(p.date)}</td>
      <td>${statusBadge(p.status)}</td>
    </tr>`).join('') : `<tr><td colspan="5"><div class="empty-state" style="padding:var(--sp-6);">
      <h4>Nenhum pagamento encontrado</h4><p>Ajuste o filtro para ver outros resultados.</p></div></td></tr>`;
}

function renderPayMethods(){
  const list = paymentsScoped();
  const grouped = {};
  list.forEach(p=>{ grouped[p.method] = (grouped[p.method]||0) + p.value; });
  const total = Object.values(grouped).reduce((a,b)=>a+b,0) || 1;
  const icons = { 'Pix':'ri-qr-code-line', 'Cartão de Crédito':'ri-bank-card-line', 'Boleto':'ri-file-list-3-line', 'Dinheiro':'ri-cash-line', 'Convênio':'ri-shield-check-line' };

  document.getElementById('payMethods').innerHTML = Object.entries(grouped).map(([method, val])=>`
    <div class="method-row">
      <i class="${icons[method] || 'ri-bank-card-line'}"></i>
      <div style="flex:1;">
        <div class="flex justify-between text-sm mb-2"><span>${method}</span><strong>${psCurrency(val)}</strong></div>
        <div class="method-bar-bg"><div class="method-bar-fill" style="width:${(val/total*100)}%"></div></div>
      </div>
    </div>`).join('') || '<p class="text-muted text-sm">Sem pagamentos registrados.</p>';
}

function renderBillingStatus(){
  const list = paymentsScoped();
  const pago = list.filter(p=>p.status==='pago').length;
  const pendente = list.filter(p=>p.status==='pendente').length;
  const atrasado = list.filter(p=>p.status==='atrasado').length;
  document.getElementById('payBillingStatus').innerHTML = `
    <div class="list-row"><span class="badge badge-success"><i class="ri-checkbox-circle-line"></i>Pago</span><span class="text-muted text-sm" style="margin-left:auto;">${pago} cobrança(s)</span></div>
    <div class="list-row"><span class="badge badge-warning"><i class="ri-time-line"></i>Pendente</span><span class="text-muted text-sm" style="margin-left:auto;">${pendente} cobrança(s)</span></div>
    <div class="list-row"><span class="badge badge-danger"><i class="ri-alert-line"></i>Atrasado</span><span class="text-muted text-sm" style="margin-left:auto;">${atrasado} cobrança(s)</span></div>
  `;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const role = PSLayout.getRole();
  const titles = { paciente: ['Financeiro', 'Seu histórico de pagamentos na clínica'] };
  const [title, crumb] = titles[role] || ['Pagamentos', 'Painel financeiro da clínica'];
  PSLayout.render('pagamentos.html', title, crumb);

  renderPayStats();
  renderPayChart();
  renderPayTable();
  renderPayMethods();
  renderBillingStatus();

  document.querySelectorAll('#payFilters .filter-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      document.querySelectorAll('#payFilters .filter-chip').forEach(c=>c.classList.remove('is-active'));
      chip.classList.add('is-active');
      payFilterStatus = chip.dataset.status;
      renderPayTable();
    });
  });

  if(typeof gsap !== 'undefined'){
    gsap.from('#payStats .stat-card', { opacity:0, y:16, stagger:.08, duration:.5, ease:'power2.out' });
    gsap.from('.pay-main .card', { opacity:0, y:16, stagger:.1, duration:.5, delay:.2, ease:'power2.out' });
    gsap.from('.bars .bar', { height:0, duration:.7, stagger:.05, ease:'power2.out', delay:.4 });
  }
});
