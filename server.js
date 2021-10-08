const path = require("path")
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const initializePassport = require('./passport-config');
const places = require("./images").places
initializePassport(
  passport,
  name => users.find(user => user.name === name),
  id => users.find(user => user.id === id)
)

const users = [{
  id: '1633583182328',
  name: 'Ajmal',
  email: 'ajmaln73@gmail.com',
  password: '$2b$10$2vrKMDJnHcDVLEmHEl6T.uhOR4p5wNMLApJqUzfEocfoMj4XBj1N.'
}]
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: "SECRETKETTOSUCCESSISPRESICE",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', isLoggedIn, (req, res) => {
  let user=req.user
  res.render('index', { user, places })
})

app.get('/login', checkNotLoggedIn, (req, res) => {
  res.render('login')
})

app.post('/login', checkNotLoggedIn, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/signup', checkNotLoggedIn, (req, res) => {
  res.render('signup')
})

app.post('/signup', checkNotLoggedIn, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    console.log(users[0]);
    res.redirect('/login')
  } catch {
    res.redirect('/signup')
  }
})

app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Authenticated");
    return res.redirect('/')
  }
  next()
}

app.listen(3000, ()=>{
  console.log("app running on port 3000");
})