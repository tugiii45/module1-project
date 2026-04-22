// listings.js - Page-specific module for listings.html
// Handles load/display/search/delete/claim with event delegation

import { getBooks, deleteBook as storageDelete, claimBook as storageClaim } from './storage.js';
import { displayBooks, filterBooks } from './ui.js';

let allBooks = [];

/**
 * Initializes listings page: load books, setup search + delegation.
 */
async function initListings() {
  allBooks = await getBooks();
  displayBooks(allBooks);

  // Search input listener
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  } else {
    console.warn('No #searchInput found');
  }

  // Event delegation for card actions
  const listingsSection = document.querySelector('.listings-section');
  if (listingsSection) {
    listingsSection.addEventListener('click', handleCardAction);
  }
}

/**
 * Handles search input: filter + redisplay.
 */
function handleSearch(event) {
  const query = event.target.value;
  const filtered = filterBooks(allBooks, query);
  displayBooks(filtered);
}

/**
 * Handles delete/claim buttons via data-action/data-id.
 */
function handleCardAction(event) {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const id = parseInt(btn.dataset.id);

  if (action === 'delete') {
    if (confirm('Delete this book listing? This cannot be undone.')) {
      allBooks = storageDelete(id);
      displayBooks(allBooks);
    }
  } else if (action === 'claim') {
    if (confirm('Claim this found book? It will be removed from listings.')) {
      allBooks = storageClaim(id);
      displayBooks(allBooks);
    }
  }
}

// Page init
document.addEventListener('DOMContentLoaded', initListings);

