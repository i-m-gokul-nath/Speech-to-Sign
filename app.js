const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

require('dotenv/config');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = `${process.env.DBURL}`;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  mongoose.set('useFindAndModify', false);

// EJS
// app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'))

// Express body parser
app.use(express.urlencoded({ extended: true }));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.get('/', (req, res) => res.render('index'));
app.use('/dashboard', require('./routes/dashboard/dashboardControler.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 5002;
//npm run-script dev
app.listen(PORT, console.log(`Server running on  ${PORT}`));