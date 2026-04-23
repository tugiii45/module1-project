// Report lost page
document.addEventListener('DOMContentLoaded', function() {
  updateNav();

  const form = document.querySelector('form[data-form-type="lost"]');
  if (form) {
    form.addEventListener('submit', saveReportData);
  }
});

