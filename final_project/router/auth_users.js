const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return username && typeof username === 'string' && username.length > 0;
  }
  
  const authenticatedUser = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    return user !== undefined;
  }
  
  //only registered users can login
  regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
  
    if (!isValid(username)) {
      return res.status(400).json({message: "Invalid username format"});
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: username
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken
      }
      
      return res.status(200).json({message: "User successfully logged in", accessToken});
    } else {
      return res.status(401).json({message: "Invalid username or password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.data;  // Get username from JWT token
  
    if (!review) {
      return res.status(400).json({message: "Review text is required"});
    }
  
    try {
      if (books[isbn]) {
        // Add or modify the review
        books[isbn].reviews[username] = review;
        
        return res.status(200).json({
          message: "Review added/modified successfully",
          book: books[isbn]
        });
      } else {
        return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
      }
    } catch(error) {
      return res.status(500).json({message: "Error adding review"});
    }
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.data;  // Get username from JWT token
  
    try {
      if (!books[isbn]) {
        return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
      }
  
      if (!books[isbn].reviews[username]) {
        return res.status(404).json({message: "No review found for this user"});
      }
  
      // Delete only the review by the current user
      delete books[isbn].reviews[username];
      
      return res.status(200).json({
        message: "Review deleted successfully",
        book: books[isbn]
      });
  
    } catch(error) {
      return res.status(500).json({message: "Error deleting review"});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
