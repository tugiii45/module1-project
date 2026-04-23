// Register page
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
    showMessage('Username exists!', 'error');
    return false;
  }
  users.push({username, password});
  saveUsers();
  showMessage(`Welcome, ${username}! Account created.`, 'success');
  window.location.href = 'index.html';
  return true;
}

