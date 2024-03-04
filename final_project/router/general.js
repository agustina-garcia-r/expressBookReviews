const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).json({ books: JSON.stringify(books) });
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json({ book });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);

    const booksByAuthor = keys.reduce((acc, key) => {
        if (books[key].author === author) {
            acc[key] = books[key];
        }
        return acc;
    }, {});

    if (Object.keys(booksByAuthor).length > 0) {
        res.status(200).json({ books: booksByAuthor });
    } else {
        res.status(404).json({ message: "No books found for the author" });
    }
});


// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);

    const booksByTitle = keys.reduce((acc, key) => {
        if (books[key].title === title) {
            acc[key] = books[key];
        }
        return acc;
    }, {});

    if (Object.keys(booksByTitle).length > 0) {
        res.status(200).json({ books: booksByTitle });
    } else {
        res.status(404).json({ message: "No books found with the specified title" });
    }
});


// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        res.status(200).json({ reviews: book.reviews });
    } else {
        res.status(404).json({ message: "No reviews found for the book with the specified ISBN" });
    }
});

module.exports.general = public_users;
