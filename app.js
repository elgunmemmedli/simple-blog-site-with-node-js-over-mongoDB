const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');



const User = require('./models/user');
// const MONGODB_URL = 
// 'mongodb+srv://elgun:QOH5GVqg14HYS3bk@cluster0.l7qn8b0.mongodb.net/publisist'
// "mongodb+srv://elgun:QOH5GVqg14HYS3bk@cluster0.l7qn8b0.mongodb.net/publisist";

const MONGODB_URI =
  'mongodb+srv://elgun:QOH5GVqg14HYS3bk@cluster0.l7qn8b0.mongodb.net/publisist';




const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
const routes = require('./routes/index');
const authRoutes = require('./routes/auth');

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.userData = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use(routes);
app.use(authRoutes);

mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(5000);
  })
  .catch(err => console.log(err));

