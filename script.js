// Core globals only - auth state, storage, nav, books core
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser');
let books = [];

// Core functions
function isLoggedIn() {
  return !!currentUser;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateNav();
  alert('Logged out!');
}

function updateNav() {
  const authLi = document.getElementById('auth-link');
  if (authLi) {
    if (isLoggedIn()) {
      authLi.innerHTML = `<a href="#" class="logout-btn" onclick="logout()">Logout (${currentUser})</a>`;
    } else {
      authLi.innerHTML = `<li><a href="login.html">Login</a></li><li><a href="register.html">Register</a></li>`;
    }
  }
}

function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

function saveCurrentUser() {
  localStorage.setItem('currentUser', currentUser);
}

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

function saveReportData(event) {
  event.preventDefault();
  if (!isLoggedIn()) {
    alert('Please log in to report books.');
    window.location.href = 'login.html';
    return;
  }

  const form = event.target;
  const formType = form.dataset.formType;
  const newBook = { id: Date.now(), userId: currentUser };
  
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
  }
  
  books.push(newBook);
  saveBooks();
  form.reset();
  alert('Report saved! Check listings.html');
  window.location.href = 'listings.html';
}

async function loadBooks() {
  const saved = localStorage.getItem('books');
  if (saved) {
    books = JSON.parse(saved);
    if (typeof displayBooks === 'function') displayBooks();
    return;
  }
  
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    books = data.books.map(book => ({
      ...book, location: '', date: '', description: '', reporter: ''
    }));
    saveBooks();
    if (typeof displayBooks === 'function') displayBooks();
  } catch (e) {
    console.error('Failed to load data.json:', e);
    books = [
      {id: 1, title: "KLB Mathematics Form 4", bookCode: "KLB-O743", Status: "Lost"},
      {id: 2, title: "Spotlight Chemistry Form 2", bookCode: "KLB-C456", Status: "Found"},
      {id: 3, title: "Oxford English Dictionary", bookCode: "OED-123", Status: "Lost"},
      {id: 4, title: "Golden Tips Geography", bookCode: "GTG-456", Status: "Found"}
    ];
    saveBooks();
    if (typeof displayBooks === 'function') displayBooks();
  }
 }

function displayBooks(bookArray = books) {
  const container = document.querySelector('.listings-section');
  if (!container) return;
  
  container.querySelectorAll('.card[data-dynamic="true"], .card.empty-state').forEach(card => container.removeChild(card));
  
  if (bookArray.length === 0) {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'card empty-state';
    emptyCard.innerHTML = '<h3>No Books Reported Yet</h3><p>Be the first to report a lost or found book!</p>';
    container.appendChild(emptyCard);
    return;
  }

  bookArray.forEach(book => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-dynamic', 'true');
    card.innerHTML = `
      <h3>${book.title || 'Unknown Title'}</h3>
      <p><strong>Book Code:</strong> ${book.bookCode}</p>
      <p><strong>Status:</strong> <span class="status-${book.Status.toLowerCase()}">${book.Status}</span></p>
      ${book.location ? `<p><strong>${book.Status === 'Lost' ? 'Last Seen:' : 'Found At:'} </strong> ${book.location}</p>` : ''}
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

function deleteBook(id) {
  if (!confirm('Delete? Cannot undo.')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  if (typeof displayBooks === 'function') displayBooks();
}

function claimBook(id) {
  if (!confirm('Claim book? Removes from list.')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  if (typeof displayBooks === 'function') displayBooks();
}

// DOMContentLoaded for nav only
document.addEventListener('DOMContentLoaded', updateNav);

