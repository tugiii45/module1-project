let books = [];

// Load books from localStorage or data.json
async function loadBooks() {
  const saved = localStorage.getItem('books');
  if (saved) {
    books = JSON.parse(saved);
    displayBooks();
    return;
  }
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    books = data.books.map(book => ({...book, location: '', date: '', description: '', reporter: ''}));
    saveBooks();
    displayBooks();
  } catch (e) {
    console.error('Failed to load data.json:', e);
    // Fallback hardcoded
    books = [
      {id: 1, title: "KLB Mathematics Form 4", bookCode: "KLB-O743", Status: "Lost"},
      {id: 2, title: "Spotlight Chemistry Form 2", bookCode: "KLB-C456", Status: "Found"},
      {id: 3, title: "Oxford English Dictionary", bookCode: "OED-123", Status: "Lost"},
      {id: 4, title: "Golden Tips Geography", bookCode: "GTG-456", Status: "Found"}
    ];
    displayBooks();
  }
}

// Save books to localStorage
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Save report data function
function saveReportData(event) {
  event.preventDefault();
  
  const form = event.target;
  const formType = form.dataset.formType;
  let newBook = { id: Date.now() }; // Unique ID
  
  if (formType === 'lost') {
    // Lost report
    newBook.title = form.querySelector('#book-title').value;
    newBook.bookCode = form.querySelector('#bookCode').value;
    newBook.Status = 'Lost';
    newBook.location = form.querySelector('#location').value;
    newBook.date = form.querySelector('#date').value;
    newBook.description = form.querySelector('#description').value;
    newBook.reporter = `${form.querySelector('#name').value} (${form.querySelector('#contact').value})`;
  } else if (formType === 'found') {
    // Found report
    newBook.title = form.querySelector('#book-title').value;
    newBook.bookCode = form.querySelector('#bookCode').value;
    newBook.Status = 'Found';
    newBook.location = form.querySelector('#location-found').value;
    newBook.date = form.querySelector('#dateFound').value;
    newBook.description = form.querySelector('#description').value;
    newBook.reporter = `${form.querySelector('#finder-name').value} (${form.querySelector('#contact').value})`;
  } else {
    // Contact or other
    alert('Message saved locally!');
    return;
  }
  
  books.push(newBook);
  saveBooks();
  form.reset();
  alert('Report saved successfully! Check listings.html');
  window.location.href = 'listings.html';
}

// Init: Load books and setup listeners
document.addEventListener('DOMContentLoaded', function() {
  loadBooks();
  
  // Attach to all report/contact forms
  document.querySelectorAll('.form-section form').forEach(form => {
    form.addEventListener('submit', saveReportData);
  });
  
  // Search setup for listings
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      const filtered = books.filter(book => 
        book.title?.toLowerCase().includes(query) ||
        book.bookCode.toLowerCase().includes(query) ||
        book.Status.toLowerCase().includes(query)
      );
      displayBooks(filtered);
    });
  }
});

// Display books as cards (for listings)
function displayBooks(bookArray = books) {
  const container = document.querySelector('.listings-section');
  const list = document.getElementById('bookList');
  
  if (list) list.innerHTML = '';
  if (!container) return;
  
  // Clear existing dynamic cards
  const existingDynamic = container.querySelectorAll('.card[data-dynamic="true"]');
  existingDynamic.forEach(card => container.removeChild(card));
  
  bookArray.forEach(book => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-dynamic', 'true');
    card.innerHTML = `
      <h3>${book.title || 'Unknown Title'}</h3>
      <p><strong>Book code:</strong> ${book.bookCode}</p>
      <p><strong>Status:</strong> ${book.Status}</p>
      ${book.location ? `<p><strong>${book.Status === 'Lost' ? 'Last seen:' : 'Found at:'}</strong> ${book.location}</p>` : ''}
      ${book.date ? `<p><strong>Date:</strong> ${book.date}</p>` : ''}
      ${book.description ? `<p><strong>Description:</strong> ${book.description}</p>` : ''}
      ${book.reporter ? `<p><strong>Reporter:</strong> ${book.reporter}</p>` : ''}
      <button onclick="deleteBook(${book.id})" class="delete-btn">Delete</button>
      ${book.Status === 'Found' ? `<button onclick="claimBook(${book.id})" class="claim-btn">Claim</button>` : ''}
    `;
    container.appendChild(card);
  });
}

// Delete by ID
function deleteBook(id) {
  if (!confirm('Delete this book?')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  displayBooks();
}

// Claim (remove found book)
function claimBook(id) {
  if (!confirm('Claim this book?')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  displayBooks();
}
