const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth", (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
  
      if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
      }
  
      // Expected format: Bearer <token>
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, "your_secret_key", (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
  
        req.user = user; // attach decoded user
        next();
      });
  
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  });

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes); 

app.listen(PORT,()=>console.log("Server is running"));
