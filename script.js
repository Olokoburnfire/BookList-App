//BOok class: rep a book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class: handle UI task
class UI{
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach((book)=> UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector("#book-list");

        const row= document.createElement('tr');

        row.innerHTML = `
        <td class = "book-stored book-title">${book.title}</td>
        <td class = "book-stored book-author">${book.author}</td>
        <td class = "book-stored book-isbn">${book.isbn}</td>
        <td class = "book-stored"><a href = "#" class = "del-btn delete">X</a></td>
        `;

        list.appendChild(row)
    }

    static deleteBook(el){
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = ` alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.content_container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}


// Store class: handle storage
class Store{
    static getBooks(){
        let  books;
        if (localStorage.getItem('books') === null) {
            books = []
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) =>{
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


//Event: Display Book

document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a book

document.querySelector("#book-form").addEventListener("submit", (e) =>{
    //prevent actual submit
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;


    // validate
    if (title === '' || author === '' || isbn ==='') {
        UI.showAlert('PLEASE FILL IN ALL FIELDS', 'danger');
    } else {
        //instatiate book
        const book = new Book(title, author, isbn);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success');

        //clear fields
        UI.clearFields();
    }

})

//EventRemove a book

document.querySelector('#book-list').addEventListener('click', (e) =>{
    //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


    // Show success message
    UI.showAlert('Book Removed', 'successful');
})