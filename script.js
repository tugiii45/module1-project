// function for filtering books in the search button
let books = [
    {title: "KLB Mathematics Form 4", bookCode: "KLB-O743", Status: "Lost"},
    {title: "Spotlight Chemistry Form 2", bookCode: "KLB-C456", Status: "Found"},
    {title: "Oxford English Dictionary", bookCode: "OED-123", Status: "Lost"},
    {title: "Golden Tips Geography", bookCode: "GTG-456", Status: "Found"}
];

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {
    const query = searchInput.value.toLowerCase();

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.bookCode.toLowerCase().includes(query) ||
        book.Status.toLowerCase().includes(query)
    );
    
    displayBooks(filteredBooks);
});

function displayBooks(bookArray = books) {
  const list = document.getElementById("bookList");
  list.innerHTML = "";

  bookArray.forEach((book, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${book.title} - ${book.bookCode} (${book.Status})
      ${
        book.Status === "Found"
          ? `<button onclick="claimBook(${index})">Claim</button>`
          : `<button onclick="deleteBook(${index})">Delete</button>`
      }
    `;

    list.appendChild(li);
  });
}

displayBooks();


function claimBook(index) {
  const confirmClaim = confirm("Do you want to claim this book?");
  if (!confirmClaim) return;

  books.splice(index, 1);
  displayBooks();
}

function deleteBook(index) {
  const confirmDelete = confirm("Do you want to delete this book?");
  if (!confirmDelete) return;

  books.splice(index, 1);
  displayBooks();
}