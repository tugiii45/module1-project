// Login page
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

function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = username;
    saveCurrentUser();
    updateNav();
    showMessage(`Welcome Back, ${username}!`, 'success');
    setTimeout(() => window.location.href = 'index.html', 2000);
    return true;
  }
  showMessage('Invalid credentials!', 'error');
  return false;
}

