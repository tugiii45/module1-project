document.addEventListener('DOMContentLoaded', function() {
  updateNav();

  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('regUsername').value;
      const password = document.getElementById('regPassword').value;
      register(username, password);
    });
  }
});

