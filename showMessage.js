function showMessage(message, type = 'success') {
  document.querySelectorAll('.message').forEach(el => el.remove());
  
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = message;
  msg.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;max-width:300px;padding:12px;border-radius:6px;font-weight:bold;animation:fadeIn 0.3s;';
  
  document.body.appendChild(msg);
  
  setTimeout(() => msg.remove(), 4000);
}
