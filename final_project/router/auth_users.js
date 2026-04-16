const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean 
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { username },
      "your_secret_key",   // move to env in real apps
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      accessToken
    });
  } else {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
 
  // get username from session
  const username = req.body.username;

  // validate input
  if (!review) {
    return res.status(400).json({
      message: "Review text is required"
    });
  }

  // check if book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // get username from session
  const username = req.body.username;

  // check login
  if (!username) {
      return res.status(401).json({ message: "User not logged in" });
  }

  // check book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // check if review exists for this user
  if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
  }

  // delete only user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;