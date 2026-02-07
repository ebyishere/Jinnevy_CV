const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session for admin login
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
