function showMessage(message, type = 'success') {
  const bg = type === 'error' ? '#ef4444' : '#22c55e';
  const color = 'white';
  document.querySelectorAll('.message').forEach(el => el.remove());
  
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = message;
  msg.style.cssText = `position:fixed;top:20px;left:20px;right:20px;max-width:400px;margin:0 auto;z-index:10000;padding:16px;border-radius:8px;font-weight:bold;animation:fadeIn 0.3s;background:${bg};color:${color};box-shadow:0 4px 12px rgba(0,0,0,0.15);`;
  
  document.body.appendChild(msg);
  
  setTimeout(() => msg.remove(), type === 'success' ? 4000 : 4000, msg);
}
