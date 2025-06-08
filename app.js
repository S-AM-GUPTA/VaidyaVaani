require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();
// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Serve static HTML pages
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});
app.get('/howitworks', (req, res) => {
    res.sendFile(path.join(__dirname, 'howitworks.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/backup', (req, res) => {
    res.sendFile(path.join(__dirname, 'backup.html'));
});

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// Routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

app.use('/', authRoutes);
app.use('/', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));