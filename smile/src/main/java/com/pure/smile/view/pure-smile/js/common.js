/* ===================================================================
   PURE SMILE — HELPERS COMPARTILHADOS
=================================================================== */
function psCurrency(v){ return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }); }

const PS_STATUS_MAP = {
  'confirmada': ['badge-info','ri-checkbox-circle-line','Confirmada'],
  'em-andamento': ['badge-warning','ri-time-line','Em andamento'],
  'cancelada': ['badge-danger','ri-close-circle-line','Cancelada'],
  'concluida': ['badge-success','ri-checkbox-circle-fill','Concluída'],
  'concluido': ['badge-success','ri-checkbox-circle-fill','Concluído'],
  'pendente': ['badge-warning','ri-time-line','Pendente'],
  'ativo': ['badge-success','ri-checkbox-circle-line','Ativo'],
  'inativo': ['badge-neutral','ri-pause-circle-line','Inativo'],
  'pago': ['badge-success','ri-checkbox-circle-line','Pago'],
  'atrasado': ['badge-danger','ri-alert-line','Atrasado'],
};

function statusBadge(status){
  const [cls, icon, label] = PS_STATUS_MAP[status] || ['badge-neutral','ri-question-line', status];
  return `<span class="badge ${cls}"><i class="${icon}"></i>${label}</span>`;
}
// alias mantido por compatibilidade
function statusBadgeSafe(status){ return statusBadge(status); }

function openModal(id){ document.getElementById(id).classList.add('is-open'); }
function closeModal(id){ document.getElementById(id).classList.remove('is-open'); }

function psFormatDate(d){ return new Date(d).toLocaleDateString('pt-BR'); }

function buildStatCard(icon, iconBg, iconColor, value, label, trend, trendDir){
  return `
    <div class="card stat-card card-hover">
      <div class="stat-card__top">
        <div class="stat-card__icon" style="background:${iconBg};color:${iconColor}"><i class="${icon}"></i></div>
        ${trend ? `<span class="stat-card__trend ${trendDir === 'up' ? 'trend-up' : 'trend-down'}">
          <i class="ri-arrow-${trendDir === 'up' ? 'up' : 'down'}-line"></i>${trend}
        </span>` : ''}
      </div>
      <div class="stat-card__value">${value}</div>
      <div class="stat-card__label">${label}</div>
    </div>`;
}

function buildBarsChart(values, labels, prefix=''){
  const max = Math.max(...values);
  return `<div class="bars">${values.map((v,i)=>`
    <div class="bar-col">
      <div class="bar" style="height:${(v/max*100)}%" data-tooltip="${prefix}${v.toLocaleString('pt-BR')}"></div>
      <div class="bar-label">${labels[i]}</div>
    </div>`).join('')}</div>`;
}
