const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    req.session.userId = user._id;
    req.session.role = user.role;
    res.redirect('/dashboard');
  } catch (err) {
    res.send('Error registering: ' + err.message);
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
      req.session.userId = user._id;
      req.session.role = user.role;
      return res.redirect('/dashboard');
    } else {
      res.send('Invalid credentials');
    }
  } catch (err) {
    res.send('Login error: ' + err.message);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;