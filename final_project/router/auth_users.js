const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check if the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    const accessToken = jwt.sign({ username: username }, "secret_key");

    return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const { username } = req.user;

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        // Modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review modified successfully" });
    }

    // Add a new review
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.user;

    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has reviewed the book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        // Delete the user's review
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    }

    return res.status(404).json({ message: "Review not found" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

