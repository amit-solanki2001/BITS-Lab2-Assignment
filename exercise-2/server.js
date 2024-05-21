const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;
const secretKey = 'yourSecretKey'; // Replace with your secret key

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Dummy user data for demonstration
const users = [
  { id: 1, username: 'user1', password: '$2b$10$N9qo8uLOickgx2ZMRZo5i.uI6e7A.o2J0e1y.m93BlOl81tA1U4Ea', role: 'admin' },
  { id: 2, username: 'user2', password: '$2b$10$N9qo8uLOickgx2ZMRZo5i.uI6e7A.o2J0e1y.m93BlOl81tA1U4Ea', role: 'user' } 
];

// Register route
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Check if the username already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user and add to users array
  const newUser = {
    id: users.length + 1,
    username: username,
    password: hashedPassword,
    role: role || 'user' // Default role to 'user' if not provided
  };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', username:username, password:hashedPassword });
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare hashed password with the provided password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

// Dummy protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});

// Admin route
app.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Admin route accessed successfully' });
});

// User route
app.get('/user', authenticateToken, (req, res) => {
    res.json({ message: 'User route accessed successfully' });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = users.find(u => u.id === user.userId); // Attach full user object to req.user
    next();
  });
}

// Middleware to authorize based on role
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
