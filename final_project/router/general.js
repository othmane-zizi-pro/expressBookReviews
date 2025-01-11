const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  users.push({ username, password });
  return res.status(201).json({message: "User registered successfully"});
});

 // Get the book list available in the shop
public_users.get('/',function (req, res) {
  try {
    res.status(200).json(JSON.stringify(books));
  } catch(error) {
    res.status(500).json({message: "Error retrieving books"});
  } 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    if (books[isbn]) {
      res.status(200).json(books[isbn]);
    } else {
      res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
  } catch(error) {
    res.status(500).json({message: "Error retrieving book details"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
  try {
    const booksByAuthor = Object.values(books).filter(book => 
      book.author.toLowerCase() === author.toLowerCase()
    );
    
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({message: `No books found for author: ${author}`});
    }
  } catch(error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  try {
    const booksByTitle = Object.values(books).filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
    
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({message: `No books found with title containing: ${title}`});
    }
  } catch(error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    if (books[isbn]) {
      res.status(200).json(books[isbn].reviews);
    } else {
      res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
  } catch(error) {
    res.status(500).json({message: "Error retrieving book reviews"});
  }
});

module.exports.general = public_users;
