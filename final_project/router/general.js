const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response);
        return response; 
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
}

public_users.get('/getallbooks', async function (req, res) {  
  try {
    const result = await getAllBooks();
    return res.status(200).json(result.data);  
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});

   
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); 
        return response; 
    } catch (error) {
        console.error("Error fetching book:", error.message);
    }
}
 

public_users.get('/getbookbyisbn/:isbn', async function (req, res) {   
  try {
    const result = await getBookByISBN(req.params.isbn);
    return res.status(200).json(result.data); 
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch book" });
  }
});

async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response;
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
    }
}

public_users.get('/getbooksbyauthor/:author', async function (req, res) {  
  try {
    const result = await getBooksByAuthor(req.params.author);
    return res.status(200).json(result.data); 
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books by author" });
  }
});
 

async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response;
    } catch (error) {
        console.error("Error fetching books by title:", error.message);
    }
} 

public_users.get('/getbooksbytitle/:title', async function (req, res) {  
  try {
    const result = await getBooksByTitle(req.params.title);
    return res.status(200).json(result.data); 
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books by title" });
  }
});

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User registered successfully"
  });
});
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here assuming books are stored here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json({book});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  let result = [];

  // 1. Get all keys of the books object
  const bookKeys = Object.keys(books);

  // 2. Iterate through the books and match author
  bookKeys.forEach(key => {
      if (books[key].author.toLowerCase() === author) {
          result.push(books[key]);
      }
  });

  // Return result
  if (result.length > 0) {
      return res.status(200).json(result);
  } else {
      return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) { 
  const title = req.params.title.toLowerCase();
  let result = [];

  // 1. Get all keys of the books object
  const bookKeys = Object.keys(books);

  // 2. Iterate through the books and match title
  bookKeys.forEach(key => {
    if (books[key].title.toLowerCase() === title) {
      result.push(books[key]);
    }
  });

  // Return result
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json({reviews: book.reviews});
  } else {
    return res.status(404).json({message: "Book not found"});
  }   
});

module.exports.general = public_users;