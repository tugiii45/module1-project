// Utility to show inline messages - to be called globally
function showMessage(message, type = 'success') {
  // Remove existing messages
  document.querySelectorAll('.message').forEach(el => el.remove());
  
  const msgEl = document.createElement('div');
  msgEl.className = `message ${type}`;
  msgEl.textContent = message;
  msgEl.style.position = 'fixed';
  msgEl.style.top = '20px';
  msgEl.style.right = '20px';
  msgEl.style.zIndex = '10000';
  msgEl.style.maxWidth = '300px';
  
  document.body.appendChild(msgEl);
  
  // Auto remove after 4s
  setTimeout(() => {
    if (msgEl.parentNode) msgEl.remove();
  }, 4000);
}
