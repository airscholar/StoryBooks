const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
// const moment = require('moment');
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

const connectDB = require('./config/db');

//load config
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//connect db
connectDB();

//passport config
require('./config/passport')(passport);

//use morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//handlebars helpers
// const { formatDate } = require('./helpers/hbs');

//handlebars
app.engine('.hbs', exphbs({
    helpers:
    {
        formatDate,
        stripTags,
        truncate,
        editIcon, 
        select
    },
    defaultLayout: 'main', extname: '.hbs'
}));
app.set('view engine', '.hbs');

//express 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    // cookie: { secure: true }
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//global var
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'));
app.use('/auth/', require('./routes/auth'));
app.use('/stories/', require('./routes/stories'));

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode and port ${PORT}`));
