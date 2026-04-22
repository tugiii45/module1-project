// Register page init - sets up form handler
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


function register(username, password) {
  if (users.find(u => u.username === username)) {
    alert('Username exists!');
    return false;
  }
  users.push({username, password});
  saveUsers();
  alert('Registered! Please log in.');
  window.location.href = 'login.html';
  return true;
}
