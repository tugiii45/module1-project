document.addEventListener('DOMContentLoaded', function() {
  updateNav();

  const form = document.querySelector('form[data-form-type="found"]');
  if (form) {
    form.addEventListener('submit', saveReportData);
  }
});

