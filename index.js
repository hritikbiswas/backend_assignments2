const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, '../db.json');

app.use(express.json());

// Read database
const readDB = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Write to database
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get all todos
app.get('/todos', (req, res) => {
  const db = readDB();
  res.json(db.todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
  const db = readDB();
  const newTodo = {
    id: db.todos.length + 1,
    title: req.body.title,
    status: req.body.status || false
  };
  db.todos.push(newTodo);
  writeDB(db);
  res.status(201).json(newTodo);
});

// Update status of todos with even IDs from false to true
app.put('/todos/even', (req, res) => {
  const db = readDB();
  db.todos = db.todos.map(todo => {
    if (todo.id % 2 === 0 && !todo.status) {
      return { ...todo, status: true };
    }
    return todo;
  });
  writeDB(db);
  res.json(db.todos);
});

// Delete all todos with status true
app.delete('/todos/true', (req, res) => {
  const db = readDB();
  db.todos = db.todos.filter(todo => !todo.status);
  writeDB(db);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
