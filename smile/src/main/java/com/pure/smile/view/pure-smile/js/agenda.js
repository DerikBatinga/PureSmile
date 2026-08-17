/* ===================================================================
   PURE SMILE — AGENDA
=================================================================== */
const AGENDA_DAYS = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
const AGENDA_HOURS = [7,8,9,10,11,12,13,14,15,16,17,18];
const SLOT_HEIGHT = 76;

let agendaView = 'week';
let agendaCurrentDay = 1;

function agendaVisibleAppointments(){
  const role = PSLayout.getRole();
  if(role === 'paciente'){
    // Paciente só pode ver a própria agenda pessoal.
    return PS_DATA.appointments.filter(a => a.patient === PS_DATA.patients[0].name);
  }
  return PS_DATA.appointments;
}

function eventTop(time){
  const [h,m] = time.split(':').map(Number);
  const startHour = AGENDA_HOURS[0];
  return ((h - startHour) + m/60) * SLOT_HEIGHT;
}
function eventHeight(duration){
  return Math.max(34, (duration/60) * SLOT_HEIGHT - 4);
}

function renderCalendar(){
  const grid = document.getElementById('calendarGrid');
  const appts = agendaVisibleAppointments();
  const days = agendaView === 'week' ? [1,2,3,4,5,6,7] : [agendaCurrentDay];

  grid.className = `calendar ${agendaView === 'day' ? 'view-day' : ''}`;

  let headHtml = `<div class="cal-head"></div>`;
  days.forEach(d=>{
    const isToday = d === 1;
    headHtml += `<div class="cal-head ${isToday ? 'is-today' : ''}"><strong>${AGENDA_DAYS[d-1]}</strong><span>${isToday ? 'Hoje' : `Dia ${d}`}</span></div>`;
  });

  let timeColHtml = `<div class="cal-time-col">${AGENDA_HOURS.map(h=>`<div class="cal-time-slot">${h}:00</div>`).join('')}</div>`;

  let dayColsHtml = '';
  days.forEach(d=>{
    const dayAppts = appts.filter(a=>a.day===d);
    dayColsHtml += `<div class="cal-day-col" style="height:${AGENDA_HOURS.length*SLOT_HEIGHT}px" data-day="${d}">
      ${dayAppts.map(a=>`
        <div class="cal-event st-${a.status}" draggable="true" data-id="${a.id}"
             style="top:${eventTop(a.time)}px; height:${eventHeight(a.duration)}px;"
             data-tooltip="${a.patient} — ${a.procedure}">
          ${a.patient}<span>${a.time} · ${a.procedure}</span>
        </div>`).join('')}
    </div>`;
  });

  grid.innerHTML = headHtml + timeColHtml + dayColsHtml;

  bindDragAndDrop();
  bindEventClicks();

  if(typeof gsap !== 'undefined'){
    gsap.from('.cal-event', { opacity:0, scale:.9, stagger:.03, duration:.35, ease:'power2.out' });
  }
}

function bindEventClicks(){
  document.querySelectorAll('.cal-event').forEach(ev=>{
    ev.addEventListener('click', ()=>{
      const appt = PS_DATA.appointments.find(a=>a.id == ev.dataset.id);
      if(!appt) return;
      PSToast(`${appt.patient} · ${appt.procedure} às ${appt.time} com ${appt.dentist}.`, 'info', 'Detalhes da consulta');
    });
  });
}

function bindDragAndDrop(){
  const role = PSLayout.getRole();
  if(role === 'paciente') return; // paciente não reagenda

  document.querySelectorAll('.cal-event').forEach(ev=>{
    ev.addEventListener('dragstart', (e)=>{
      e.dataTransfer.setData('text/plain', ev.dataset.id);
      setTimeout(()=> ev.style.opacity = '.4', 0);
    });
    ev.addEventListener('dragend', ()=> ev.style.opacity = '1');
  });

  document.querySelectorAll('.cal-day-col').forEach(col=>{
    col.addEventListener('dragover', (e)=>{ e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', ()=> col.classList.remove('drag-over'));
    col.addEventListener('drop', (e)=>{
      e.preventDefault();
      col.classList.remove('drag-over');
      const id = parseInt(e.dataTransfer.getData('text/plain'));
      const appt = PS_DATA.appointments.find(a=>a.id===id);
      if(appt){
        appt.day = parseInt(col.dataset.day);
        renderCalendar();
        PSToast(`Consulta de ${appt.patient} reagendada para o dia ${appt.day}.`, 'success', 'Reagendado');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  const role = PSLayout.getRole();
  const titles = {
    paciente: ['Minha Agenda', 'Suas consultas marcadas na clínica'],
  };
  const [title, crumb] = titles[role] || ['Agenda', 'Visão semanal e diária dos atendimentos'];
  PSLayout.render('agenda.html', title, crumb);

  renderCalendar();

  document.querySelectorAll('.agenda-view-switch button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.agenda-view-switch button').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      agendaView = btn.dataset.view;
      renderCalendar();
    });
  });

  // Popular selects do modal (apenas perfis administrativos podem agendar)
  const patientSelect = document.getElementById('apptPatient');
  const dentistSelect = document.getElementById('apptDentist');
  if(patientSelect){
    patientSelect.innerHTML = PS_DATA.patients.map(p=>`<option>${p.name}</option>`).join('');
    dentistSelect.innerHTML = PS_DATA.dentists.map(d=>`<option>${d.name}</option>`).join('');
  }

  const btnNew = document.getElementById('btnNewAppointment');
  if(role === 'paciente'){
    btnNew.innerHTML = '<i class="ri-calendar-event-line"></i> Solicitar consulta';
  }
  btnNew.addEventListener('click', ()=> openModal('modalAppointment'));
  document.querySelectorAll('[data-close-modal]').forEach(b=> b.addEventListener('click', ()=> closeModal('modalAppointment')));

  document.getElementById('btnSaveAppointment').addEventListener('click', ()=>{
    closeModal('modalAppointment');
    PSToast(role === 'paciente' ? 'Sua solicitação foi enviada à recepção.' : 'Consulta agendada com sucesso.', 'success', 'Tudo certo');
  });

  if(new URLSearchParams(location.search).get('new') === '1') openModal('modalAppointment');
});
