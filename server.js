const express = require('express');
const mongoose = require('mongoose');
const bodryParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body parser middleware
app.use(bodryParser.urlencoded({ extended: false }));
app.use(bodryParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to mongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true },
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
