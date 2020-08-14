const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const mongoose=require('mongoose');
const passport=require('passport');
const morgan = require('morgan');
const MongoStore =require('connect-mongo')(session);
const dotenv=require('dotenv');
const connectDB =require('./config/db');

//load config
dotenv.config({path:'./config/config.env'});

//mongoose connectt
// mongoose.connect('mongodb://localhost/sportsBlog');
// const db=mongoose.connection;
// Port
const port =process.env.PORT || 3000;

connectDB();
// init app
const app = express();
app.locals.moment =require('moment');

const index = require('./routes/index');
const articles = require('./routes/articles');
const categories= require('./routes/categories');
const manage = require('./routes/manage');

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express ession
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false,
  store:new MongoStore({mongooseConnection:mongoose.connection})
}));
// Express validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      const namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Passport config
require('./config/passport')(passport)


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', index);
app.use('/articles', articles);
app.use('/categories', categories);
app.use('/manage', manage);
app.use('/auth', require('./routes/auth'));

app.listen(port, () => {
  console.log(`Server started in ${process.env.NODE_ENV} mode on port ${port} `);
});
