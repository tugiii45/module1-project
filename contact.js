
document.addEventListener('DOMContentLoaded', function() {
  updateNav();

  const form = document.querySelector('.form-section form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      showMessage('Message saved locally!', 'success');
      form.reset();
    });
  }
});

