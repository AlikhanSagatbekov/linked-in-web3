const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

let users = [];
fs.readFile(__dirname + '/data/users.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    users = JSON.parse(data);
});

// Обработка запросов
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route for rendering registration page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});


// Регистрация пользователя
app.post('/register', (req, res) => {
  const { username, fullName, email, password } = req.body;
  // Check if username already exists
  if (users.find(u => u.username === username)) {
      res.status(400).send('Username already exists');
      return;
  }
  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);
  // Save new user to users array
  users.push({ username, fullName, email, password: hashedPassword, friends: [] });
  // Update users.json file
  fs.writeFile(__dirname + '/data/users.json', JSON.stringify(users), (err) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error saving user data');
          return;
      }
      console.log('User registered successfully');
      res.redirect('/login');
  });
});

// Авторизация пользователя
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).send('Invalid username or password');
      return;
  }
  req.session.user = username; // Set user in session
  res.redirect('/profile');
});

app.get('/profile', (req, res) => {
  const user = req.session.user;
  if (!user) {
      res.redirect('/login'); // Redirect to login if user not authenticated
      return;
  }
  // Find user data
  const userData = users.find(u => u.username === user);
  if (!userData) {
      res.status(404).send('User not found');
      return;
  }
  res.sendFile(__dirname + '/public/profile.html');
});

// Route for fetching user profile data
app.get('/profileData', (req, res) => {
  const user = req.session.user;
  if (!user) {
      res.status(401).send('Unauthorized');
      return;
  }
  // Find user data
  const userData = users.find(u => u.username === user);
  if (!userData) {
      res.status(404).send('User not found');
      return;
  }
  res.json(userData);
});

app.post('/updateWalletAddress', (req, res) => {
    console.log(req.body);
    const { username, address } = req.body;

    // Find the user in the database
    const user = users.find(u => u.username === username);

    if (!user) {
        console.log(username);
        res.status(404).send('User not found');
        return;
    }

    // Update the wallet address for the user
    user.walletAddress = address;

    // Update users.json file
    fs.writeFile(__dirname + '/data/users.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving user data');
            return;
        }
        console.log(`Wallet address updated for ${username}: ${address}`);
        res.sendStatus(200);
    });
});

// Route for handling logout
app.get('/logout', (req, res) => {
  req.session.destroy(); // Destroy session
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
