
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser');
let books = [];

// Init nav on all pages
document.addEventListener('DOMContentLoaded', function() {
  updateNav();
  
  // Page-specific init
  initPage();
});

// Page-specific initialization
function initPage() {
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage.includes('login')) {
    initLogin();
  } else if (currentPage.includes('register')) {
    initRegister();
  } else if (currentPage.includes('listings')) {
    initListings();
  } else if (currentPage.includes('report-lost')) {
    initReportLost();
  } else if (currentPage.includes('report-found')) {
    initReportFound();
  } else if (currentPage.includes('contact')) {
    initContact();
  }
}

// Auth functions
function isLoggedIn() {
  return !!currentUser;
}

function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = username;
    saveCurrentUser();
    updateNav();
    alert('Logged in!');
    window.history.back();
    return true;
  }
  alert('Invalid credentials!');
  return false;
}

function register(username, password) {
  if (users.find(u => u.username === username)) {
    alert('Username exists!');
    return false;
  }
  users.push({username, password});
  saveUsers();
  alert('Registered! Please log in.');
  window.location.href = 'login.html';
  return true;
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
      authLi.innerHTML = `<a href="#" onclick="logout()">Logout (${currentUser})</a>`;
    } else {
      authLi.innerHTML = `<li><a href="login.html">Login</a></li><li><a href="register.html">Register</a></li>`;
    }
  }
}

// Storage functions
function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

function saveCurrentUser() {
  localStorage.setItem('currentUser', currentUser);
}

// Page inits
function initLogin() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
      login(username, password);
    });
  }
}

function initRegister() {
  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('regUsername').value;
      const password = document.getElementById('regPassword').value;
      register(username, password);
    });
  }
}

function initListings() {
  if (!isLoggedIn()) {
    const section = document.querySelector('.listings-section');
    if (section) section.innerHTML = '<div class="auth-message"><h2>Please <a href="login.html">log in</a> to view listings.</h2></div>';
    return;
  }
  
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
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    document.getElementById('clearSearch').addEventListener('click', () => {
      searchInput.value = '';
      displayBooks();
    });
  }
}

function initReportLost() {
  const form = document.querySelector('form[data-form-type="lost"]');
  if (form) form.addEventListener('submit', saveReportData);
}

function initReportFound() {
  const form = document.querySelector('form[data-form-type="found"]');
  if (form) form.addEventListener('submit', saveReportData);
}

function initContact() {
  const form = document.querySelector('.form-section form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      alert('Message saved locally!');
      form.reset();
    });
  }
}

// Books functions
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
  displayBooks();
}

function claimBook(id) {
  if (!confirm('Claim book? Removes from list.')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  displayBooks();
}

