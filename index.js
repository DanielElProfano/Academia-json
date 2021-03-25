require('dotenv').config();
const express = require('express');
require('./db')
const Course = require('./models/Course');
const Subject = require('./models/Subject')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const PORT = process.env.PORT || 3000;
const server = express();
var cors = require('cors');
const passport = require('passport');
require('./passport');

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

server.use(cors({
  origin: ['http://localhost:3000', 'https://ashacademy.netlify.app']}
));

const path = require('path');

server.use(passport.initialize());

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'hbs');

server.use(express.json());
server.use(express.urlencoded({ extended: true }));


// server.set('trust proxy', true);  //habilita cookie de sesion desde heroku
server.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false, 
    cookie: {
      maxAge: 36000000,
      // secure: true,
      sameSite: 'none',
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

server.use(passport.initialize());
server.use(passport.session());

server.use(express.static(path.join(__dirname, 'public')));

const isAuthenticated = require('./middleware/authenticated.middleware');

const courseRouter = require('./routes/course.routes');
const subjectRouter = require('./routes/subject.routes');
const professorRouter = require('./routes/professor.routes');
const studentRouter = require('./routes/student.routes');
const indexRouter = require('./routes/login.routes');
const utilsRouter = require('./routes/utils.routes');

server.use('/professor', [isAuthenticated.isAuthenticated], professorRouter);
server.use('/course', [isAuthenticated.isAuthenticated], courseRouter);
server.use('/subject', [isAuthenticated.isAuthenticated], subjectRouter);
server.use('/student', [isAuthenticated.isAuthenticated], studentRouter);
server.use('/login', indexRouter);
server.use('/utils', [isAuthenticated.isAuthenticated], utilsRouter);

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});