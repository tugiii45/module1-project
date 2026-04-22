document.addEventListener('DOMContentLoaded', function() {
  // Auth check for listings
  if (!isLoggedIn()) {
    const section = document.querySelector('.listings-section');
    section.innerHTML = '<div class="auth-message"><h2>Please <a href="login.html">log in</a> to view listings.</h2></div>';
    return;
  }

  // Update nav
  updateNav();

  // Load and display books
  loadBooks();

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const clearBtn = document.getElementById('clearSearch');

  if (searchInput) {
    const handleSearch = function() {
      const query = searchInput.value.toLowerCase();
      const filtered = books.filter(book => 
        (book.title || '').toLowerCase().includes(query) ||
        book.bookCode.toLowerCase().includes(query) ||
        (book.Status || '').toLowerCase().includes(query)
      );
      displayBooks(filtered);
    };

    searchInput.addEventListener('input', handleSearch);
    
    if (searchButton) {
      searchButton.addEventListener('click', handleSearch);
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (searchInput) searchInput.value = '';
      displayBooks();
    });
  }
});

