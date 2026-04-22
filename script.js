

 // Main book list - grows with user reports
 // localStorage saves it when page closes
let books = [];

 /**
 * Loads books: browser save first, then data.json, then samples
 * Calls displayBooks to show them
 */
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
    books = data.books.map(book => ({
      ...book, 
      location: '', 
      date: '', 
      description: '', 
      reporter: ''
    }));
    saveBooks();
    displayBooks();
  } catch (e) {
    console.error('Failed to load data.json:', e);
    books = [
      {id: 1, title: "KLB Mathematics Form 4", bookCode: "KLB-O743", Status: "Lost"},
      {id: 2, title: "Spotlight Chemistry Form 2", bookCode: "KLB-C456", Status: "Found"},
      {id: 3, title: "Oxford English Dictionary", bookCode: "OED-123", Status: "Lost"},
      {id: 4, title: "Golden Tips Geography", bookCode: "GTG-456", Status: "Found"}
    ];
    displayBooks();
  }
 }

 /**
 * Saves book list to browser storage
 */
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

/**
 * Saves form data: lost or found book details to list
 * Clears form, alerts, goes to listings
 */
function saveReportData(event) {
  event.preventDefault();
  
  const form = event.target;
  const formType = form.dataset.formType;
  const newBook = { id: Date.now() };
  
  if (formType === 'lost') {
    newBook.title = form.querySelector('#book-title').value;
    newBook.bookCode = form.querySelector('#bookCode').value;
    newBook.Status = 'Lost';
    newBook.location = form.querySelector('#location').value;
    newBook.date = form.querySelector('#date').value;
    newBook.description = form.querySelector('#description').value;
    newBook.reporter = `${form.querySelector('#name').value} (${form.querySelector('#contact').value})`;
  } else if (formType === 'found') {
    newBook.title = '';
    newBook.bookCode = form.querySelector('#bookCode').value;
    newBook.Status = 'Found';
    newBook.location = form.querySelector('#location-found').value;
    newBook.date = form.querySelector('#dateFound').value;
    newBook.description = form.querySelector('#description').value;
    newBook.reporter = `${form.querySelector('#finder-name').value} (${form.querySelector('#contact').value})`;
  } else {
    alert('Message saved locally!');
    return;
  }
  
  books.push(newBook);
  saveBooks();
  form.reset();
  alert('Report saved! Check listings.html');
  window.location.href = 'listings.html';
}

// Page ready: load books, connect forms, add search
document.addEventListener('DOMContentLoaded', function() {
  loadBooks();
  
  document.querySelectorAll('.form-section form').forEach(form => {
    form.addEventListener('submit', saveReportData);
  });
  
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

/**
 * Shows books as cards - clears old, builds new
 */
function displayBooks(bookArray = books) {
  const container = document.querySelector('.listings-section');
  if (!container) return;
  
  // Remove old cards
  const existingDynamic = container.querySelectorAll('.card[data-dynamic="true"]');
  existingDynamic.forEach(card => container.removeChild(card));
  
  // Add new cards
  bookArray.forEach(book => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-dynamic', 'true');
    card.innerHTML = `
      <h3>${book.title || 'Unknown Title'}</h3>
      <p><strong>Book Code:</strong> ${book.bookCode}</p>
      <p><strong>Status:</strong> <span class="status-${book.Status.toLowerCase()}">${book.Status}</span></p>
      ${book.location ? `<p><strong>${book.Status === 'Lost' ? 'Last Seen:' : 'Found At:'}</strong> ${book.location}</p>` : ''}
      ${book.date ? `<p><strong>Date:</strong> ${book.date}</p>` : ''}
      ${book.description ? `<p><strong>Description:</strong> ${book.description}</p>` : ''}
      ${book.reporter ? `<p><strong>Reported By:</strong> ${book.reporter}</p>` : ''}
      <div class="card-actions">
        <button onclick="deleteBook(${book.id})" class="delete-btn">Delete</button>
        ${book.Status === 'Found' ? `<button onclick="claimBook(${book.id})" class="claim-btn">Claim</button>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * Delete book after confirm, save & refresh
 */
function deleteBook(id) {
  if (!confirm('Delete? Cannot undo.')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  displayBooks();
}

/**
 * Claim found book (remove), save & refresh  
 */
function claimBook(id) {
  if (!confirm('Claim book? Removes from list.')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  displayBooks();
}

