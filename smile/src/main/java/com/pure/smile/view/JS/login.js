// Clique nos chips alterna entre os tipos de sidebar e navbar
document.querySelectorAll('.role-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
        document.querySelectorAll('.role-chip').forEach(function (c) {
            c.classList.remove('is-active');
        });
        this.classList.add('is-active');
    });
});

// Quando vai para submit ele grava o perfil e justa a sidebar e navbar
document.getElementById('formLogin').addEventListener('submit', function (e) {
    e.preventDefault();
    const role = document.querySelector('.role-chip.is-active').dataset.role;
    localStorage.setItem('ps-role', role);
    window.location.href = 'dashboard.html';
});