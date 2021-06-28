const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const axios = require('axios')
const layouts = require("express-ejs-layouts");
//const auth = require('./config/auth.js');


const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect( 'mongodb://localhost/authDemo');
//const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const waterDataRouter = require('./routes/waterData');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/water',waterDataRouter);


const myLogger = (req,res,next) => {
  console.log('inside a route!')
  next()
}
app.get('/info',(req,res) => {
  res.render('info')
})

app.get('/about',(req,res) => {
  res.render('about')
})

app.get('/aboutliang',(req,res) => {
  res.render('aboutliang')
})

app.get('/aboutyiming',(req,res) => {
  res.render('aboutyiming')
})

app.get("/survey",
  myLogger,
  isLoggedIn,
  (req,res) => {
  res.render("survey")
})

app.get("/score",
  myLogger,
  isLoggedIn,
  (req,res) => {
  res.render("score")
})

app.post('/calcScore', (req,res) => {
  const aa = parseFloat(req.body.aa)
  const bb = parseFloat(req.body.bb)
  const cc = parseFloat(req.body.cc)
  const dd = parseFloat(req.body.dd)
  const ee = parseFloat(req.body.ee)
  const ff = parseFloat(req.body.ff)
  const gg = parseFloat(req.body.gg)
  const hh = parseFloat(req.body.hh)
  const ii = parseFloat(req.body.ii)
  const jj = parseFloat(req.body.jj)
  const finalscore = aa + bb + cc + dd + ee + ff + gg + hh + ii + jj
  res.locals.finalscore = finalscore
  res.render('showScore')
})

app.get('/profiles',
    isLoggedIn,
    async (req,res,next) => {
      try {
        res.locals.profiles = await User.find({})
        res.render('profiles')
      }
      catch(e){
        next(e)
      }
    }
  )

app.use('/publicprofile/:userId',
    async (req,res,next) => {
      try {
        let userId = req.params.userId
        res.locals.profile = await User.findOne({_id:userId})
        res.render('publicprofile')
      }
      catch(e){
        console.log("Error in /profile/userId:")
        next(e)
      }
    }
)


app.get('/profile',
    isLoggedIn,
    (req,res) => {
      res.render('profile')
    })

app.get('/editProfile',
    isLoggedIn,
    (req,res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req,res,next) => {
      try {
        let username = req.body.username
        let age = req.body.age
        req.user.username = username
        req.user.age = age
        req.user.imageURL = req.body.imageURL
        await req.user.save()
        res.redirect('/profile')
      } catch (error) {
        next(error)
      }

    })


  //yimng zhang editing
  app.post('/calcwater', (req,res) => {
   // converts form parameter from string to float
    const weight = parseFloat(req.body.weight)
    res.locals.weight = weight
    res.locals.worker = req.body.worker
    res.locals.brainworker=0.0326*weight
    res.locals.physicalworker=0.0434*weight
    res.locals.needmore =req.body.needmore
    res.locals.needless =req.body.needless
    res.locals.pregnant =req.body.pregnant
    res.locals.brainworkerneedmore=0.0326*weight+0.5
    res.locals.physicalworkerneedmore=0.0434*weight+0.5
    res.locals.brainworkerneedless=0.0326*weight-0.5
    res.locals.physicalworkerneedless=0.0434*weight-0.5

    res.render('showResult')
  })



app.use('/daTa',(req,res) => {
  res.json([{a:1,b:2},{a:5,b:3}]);
})

const User = require('./models/User');

app.get("/test",async (req,res,next) => {
  try{
    const u = await User.find({})
    console.log("found u "+u)
  }catch(e){
    next(e)
  }

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
