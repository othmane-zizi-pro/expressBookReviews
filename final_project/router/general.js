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

const axios = require('axios');

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Simulate an API call with axios (in real app, this would be a real API endpoint)
    const response = await axios.get('http://localhost:5000/api/books', {
      data: books  // Passing books as mock data
    });
    
    res.status(200).json(response.data);
  } catch(error) {
    res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  } 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
      // Simulate an API call with axios
      const response = await axios.get(`http://localhost:5000/api/books/${isbn}`, {
        data: { book: books[isbn] }  // Passing specific book as mock data
      });
      
      if (response.data.book) {
        res.status(200).json(response.data.book);
      } else {
        res.status(404).json({message: `Book with ISBN ${isbn} not found`});
      }
    } catch(error) {
      res.status(500).json({
        message: "Error retrieving book details",
        error: error.message
      });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    
    try {
      // Simulate an API call with axios
      const response = await axios.get(`http://localhost:5000/api/books/author/${author}`, {
        data: { books }  // Passing books as mock data
      });
  
      const booksByAuthor = Object.values(books).filter(book => 
        book.author.toLowerCase() === author.toLowerCase()
      );
      
      if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
      } else {
        res.status(404).json({message: `No books found for author: ${author}`});
      }
    } catch(error) {
      res.status(500).json({
        message: "Error retrieving books",
        error: error.message
      });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    
    try {
      // Simulate an API call with axios
      const response = await axios.get(`http://localhost:5000/api/books/title/${title}`, {
        data: { books }  // Passing books as mock data
      });
  
      const booksByTitle = Object.values(books).filter(book => 
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      
      if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
      } else {
        res.status(404).json({message: `No books found with title containing: ${title}`});
      }
    } catch(error) {
      res.status(500).json({
        message: "Error retrieving books",
        error: error.message
      });
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
