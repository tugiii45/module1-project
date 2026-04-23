// Listings page
document.addEventListener('DOMContentLoaded', function() {
  if (!isLoggedIn()) {
    const section = document.querySelector('.listings-section');
    if (section) section.innerHTML = '<div class="auth-message"><h2>Please <a href="login.html">log in</a> to view listings.</h2></div>';
    return;
  }
  
  updateNav();
  loadBooks();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    const handleSearch = () => {
      const query = searchInput.value.toLowerCase();
      const filtered = books.filter(book => 
        (book.title || '').toLowerCase().includes(query) ||
        book.bookCode.toLowerCase().includes(query) ||
        (book.Status || '').toLowerCase().includes(query)
      );
      displayBooks(filtered);
    };
    searchInput.addEventListener('input', handleSearch);
    document.getElementById('searchButton')?.addEventListener('click', handleSearch);
    document.getElementById('clearSearch')?.addEventListener('click', () => {
      searchInput.value = '';
      displayBooks();
    });
  }
});

