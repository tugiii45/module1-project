/**
 * LostLeaf Book Tracker - Main JavaScript Application
 * Handles book reporting (lost/found), persistence via localStorage, 
 * dynamic listings display, search, delete, and claim functionality.
 */

 // Global books array - stores all lost/found book reports
let books = [];

 /**
 * Loads books from localStorage (persistent) or initializes from data.json + fallback.
 * Automatically displays books on load.
 */
async function loadBooks() {
  const saved = localStorage.getItem('books');
  if (saved) {
    books = JSON.parse(saved);
    displayBooks();
    return;
  }
  
  try {
    // Try loading initial data from data.json
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
    // Fallback to hardcoded sample data
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
 * Persists the books array to localStorage for cross-session persistence.
 */
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

/**
 * Handles form submission for lost/found reports.
 * Uses data-form-type attribute for form type detection.
 * Saves new book report, resets form, alerts user, redirects to listings.
 */
function saveReportData(event) {
  event.preventDefault();
  
  const form = event.target;
  const formType = form.dataset.formType;
  const newBook = { id: Date.now() }; // Unique timestamp-based ID
  
  if (formType === 'lost') {
    // Process lost book report
    newBook.title = form.querySelector('#book-title').value;
    newBook.bookCode = form.querySelector('#bookCode').value;
    newBook.Status = 'Lost';
    newBook.location = form.querySelector('#location').value;
    newBook.date = form.querySelector('#date').value;
    newBook.description = form.querySelector('#description').value;
    newBook.reporter = `${form.querySelector('#name').value} (${form.querySelector('#contact').value})`;
  } else if (formType === 'found') {
    // Process found book report
    newBook.title = ''; // Title unknown for found books
    newBook.bookCode = form.querySelector('#bookCode').value;
    newBook.Status = 'Found';
    newBook.location = form.querySelector('#location-found').value;
    newBook.date = form.querySelector('#dateFound').value;
    newBook.description = form.querySelector('#description').value;
    newBook.reporter = `${form.querySelector('#finder-name').value} (${form.querySelector('#contact').value})`;
  } else {
    // Handle contact/other forms
    alert('Message saved locally!');
    return;
  }
  
  books.push(newBook);
  saveBooks();
  form.reset();
  alert('Report saved successfully! Check listings.html');
  window.location.href = 'listings.html';
}

// Document ready - initialize app
document.addEventListener('DOMContentLoaded', function() {
  loadBooks();
  
  // Attach submit handlers to all report forms (.form-section form)
  document.querySelectorAll('.form-section form').forEach(form => {
    form.addEventListener('submit', saveReportData);
  });
  
  // Setup real-time search for listings page
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
 * Dynamically renders book listings as cards in .listings-section.
 * Clears previous dynamic cards before rendering new ones.
 * Supports filtered arrays for search functionality.
 */
function displayBooks(bookArray = books) {
  const container = document.querySelector('.listings-section');
  if (!container) return;
  
  // Clear previous dynamic content
  const existingDynamic = container.querySelectorAll('.card[data-dynamic="true"]');
  existingDynamic.forEach(card => container.removeChild(card));
  
  // Render each book as a card
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
 * Deletes a book listing by ID after user confirmation.
 * Updates localStorage and refreshes display.
 */
function deleteBook(id) {
  if (!confirm('Delete this book listing? This cannot be undone.')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  displayBooks();
}

/**
 * Claims (removes) a found book listing after confirmation.
 * Updates localStorage and refreshes display.
 */
function claimBook(id) {
  if (!confirm('Claim this found book? It will be removed from listings.')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  displayBooks();
}

