/* ============================================================
   DRAWER — Menu lateral (app-5.js)
   ============================================================ */

window.openDrawer = function() {
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('drawerBackdrop')?.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeDrawer = function() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('drawerBackdrop')?.classList.remove('open');
  document.body.style.overflow = '';
};

window.toggleDrawer = function() {
  const d = document.getElementById('drawer');
  if (d && d.classList.contains('open')) closeDrawer();
  else openDrawer();
};

document.addEventListener('DOMContentLoaded', function() {
  // Fecha o drawer ao clicar em um item de navegação (só em mobile)
  document.querySelectorAll('.drawer-items button[data-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (window.innerWidth < 900) closeDrawer();
    });
  });

  // Preenche o avatar do topbar com a inicial do usuário
  const topbarUser = document.getElementById('topbarUser');
  if (topbarUser) {
    try {
      const name = (authUser && authUser.name) || '?';
      topbarUser.textContent = name.trim().charAt(0).toUpperCase() || '?';
    } catch (e) {}
  }
});

// Fecha com ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeDrawer();
});

// Se a janela for redimensionada pra desktop, garante que o drawer está fechado visualmente
window.addEventListener('resize', function() {
  if (window.innerWidth >= 900) closeDrawer();
});