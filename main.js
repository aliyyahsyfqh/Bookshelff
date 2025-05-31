const bookForm = document.getElementById('bookForm');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const searchForm = document.getElementById('searchBook');
const searchInput = document.getElementById('searchBookTitle');

let books = JSON.parse(localStorage.getItem('bookshelf_books')) || [];

function generateId() {
  return +new Date();
}

function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.textContent = `Tahun: ${book.year}`;

  const actionDiv = document.createElement('div');

  const toggleCompleteBtn = document.createElement('button');
  toggleCompleteBtn.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleCompleteBtn.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleCompleteBtn.addEventListener('click', () => {
    toggleBookComplete(book.id);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteBtn.textContent = 'Hapus Buku';
  deleteBtn.addEventListener('click', () => {
    deleteBook(book.id);
  });

  const editBtn = document.createElement('button');
  editBtn.setAttribute('data-testid', 'bookItemEditButton');
  editBtn.textContent = 'Edit Buku';
  editBtn.addEventListener('click', () => {
    editBook(book.id);
  });

  actionDiv.append(toggleCompleteBtn, deleteBtn, editBtn);

  bookItem.append(title, author, year, actionDiv);

  return bookItem;
}

function renderBooks(filterTitle = '') {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(filterTitle.toLowerCase())
  );

  filteredBooks.forEach(book => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function saveBooks() {
  localStorage.setItem('bookshelf_books', JSON.stringify(books));
}

bookForm.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('bookFormTitle').value.trim();
  const author = document.getElementById('bookFormAuthor').value.trim();
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (!title || !author || !year) {
    alert('Mohon isi semua data dengan benar!');
    return;
  }

  if (bookForm.dataset.editingId) {
    const editId = Number(bookForm.dataset.editingId);
    const bookIndex = books.findIndex(b => b.id === editId);
    if (bookIndex > -1) {
      books[bookIndex].title = title;
      books[bookIndex].author = author;
      books[bookIndex].year = year;
      books[bookIndex].isComplete = isComplete;
      delete bookForm.dataset.editingId;
      bookForm.querySelector('button[type="submit"] span').textContent = 'Belum selesai dibaca';
    }
  } else {
    const newBook = {
      id: generateId(),
      title,
      author,
      year,
      isComplete
    };
    books.push(newBook);
  }

  saveBooks();
  renderBooks();
  bookForm.reset();
});

function toggleBookComplete(id) {
  const book = books.find(b => b.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
  }
}

function deleteBook(id) {
  if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
    books = books.filter(b => b.id !== id);
    saveBooks();
    renderBooks();
  }
}

function editBook(id) {
  const book = books.find(b => b.id === id);
  if (book) {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    bookForm.dataset.editingId = id;
    bookForm.querySelector('button[type="submit"] span').textContent = book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';
  }
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const keyword = searchInput.value.trim();
  renderBooks(keyword);
});

renderBooks();
