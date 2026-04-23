// Login page init - sets up form handler
document.addEventListener('DOMContentLoaded', function() {
  updateNav();

  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
      login(username, password);
    });
  }
});




