/* ===================================================================
   PURE SMILE — TOAST NOTIFICATIONS
=================================================================== */
(function(){
  const ICONS = {
    success: 'ri-checkbox-circle-fill',
    warning: 'ri-alert-fill',
    danger: 'ri-error-warning-fill',
    info: 'ri-information-fill',
  };
  const TITLES = {
    success: 'Sucesso',
    warning: 'Atenção',
    danger: 'Erro',
    info: 'Aviso',
  };

  function ensureStack(){
    let stack = document.querySelector('.toast-stack');
    if(!stack){
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    return stack;
  }

  window.PSToast = function(message, type = 'info', title){
    const stack = ensureStack();
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
      <i class="toast__icon ${ICONS[type] || ICONS.info}"></i>
      <div>
        <div class="toast__title">${title || TITLES[type]}</div>
        <div class="toast__msg">${message}</div>
      </div>
      <button class="toast__close"><i class="ri-close-line"></i></button>
    `;
    stack.appendChild(el);
    const remove = () => {
      el.classList.add('is-leaving');
      setTimeout(()=> el.remove(), 260);
    };
    el.querySelector('.toast__close').addEventListener('click', remove);
    setTimeout(remove, 4500);
  };
})();
