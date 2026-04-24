// Register page
document.addEventListener('DOMContentLoaded', function() {
  updateNav();

  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validatePasswords()) return;
      const username = document.getElementById('regUsername').value;
      const password = document.getElementById('regPassword').value;
      register(username, password);
    });
  }

  // Clear inline error as the user types
  const regPassword = document.getElementById('regPassword');
  const regConfirmPassword = document.getElementById('regConfirmPassword');
  if (regPassword) regPassword.addEventListener('input', clearPasswordError);
  if (regConfirmPassword) regConfirmPassword.addEventListener('input', clearPasswordError);
});

function register(username, password) {
  if (users.find(u => u.username === username)) {
    showMessage('Username exists!', 'error');
    return false;
  }
  users.push({username, password});
  saveUsers();
  showMessage(`Welcome, ${username}! Account created.`, 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2500);
  return true;
}

function validatePasswords() {
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  const confirmInput = document.getElementById("regConfirmPassword");
  let errorSpan = confirmInput.parentNode.querySelector('.inline-error');

  if (password !== confirmPassword) {
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'inline-error';
      errorSpan.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px; display: block;';
      confirmInput.parentNode.appendChild(errorSpan);
    }
    errorSpan.textContent = 'Passwords do not match.';
    errorSpan.style.display = 'block';
    return false;
  } else {
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
    }
    return true;
  }
}

function clearPasswordError() {
  const errorSpan = document.querySelector('.inline-error');
  if (errorSpan) {
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
  }
}

