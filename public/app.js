const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 300;

app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, 'users.json');

// Обработка запросов

// Регистрация пользователя
app.post('/register', (req, res) => {
  const { username, password, walletAddress } = req.body;

  try {
    // Чтение текущих пользователей из JSON-файла
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Проверка наличия пользователя с таким именем
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ error: 'Пользователь с таким именем уже зарегистрирован' });
    }

    // Добавление нового пользователя
    const newUser = { username, password, walletAddress };
    users.push(newUser);

    // Запись обновленных данных в JSON-файл
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Авторизация пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  try {
    // Чтение текущих пользователей из JSON-файла
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Поиск пользователя по имени и паролю
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

// Подключение кошелька
app.post('/connect-wallet', (req, res) => {
  const { username, walletAddress } = req.body;

  try {
    // Чтение текущих пользователей из JSON-файла
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Поиск пользователя по имени
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновление адреса кошелька пользователя
    user.walletAddress = walletAddress;

    // Запись обновленных данных в JSON-файл
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при подключении кошелька:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
