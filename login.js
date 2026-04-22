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
    alert('Logged in!');
    window.history.back();
    return true;
  }
  alert('Invalid credentials!');
  return false;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateNav();
  alert('Logged out!');
}

