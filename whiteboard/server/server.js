// REQUIRE PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const socket = require('socket.io');
const path = require('path');

// REQUIRE LOCAL FILES
const config = require('./../config');
var mainCtrl = require('./mainCtrl');

// INVOKE EXPRESS AND SET UP MIDDLEWARE
const app = express();
app.use(bodyParser.json());
// app.use(express.static(__dirname + './../build'));


// DATABASE CONNECTION
massive(config.connectionString)
.then( db => {
    app.set('db', db);
    console.log('successful db hookup')
  })
.catch( err => console.log(err));

// SESSIONS & AUTH0 & PASSPORT
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 14}
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
  domain: config.auth0.domain,
  clientID: config.auth0.clientID,
  clientSecret: config.auth0.clientSecret,
  callbackURL: config.auth0.callbackURL
}, function(accessToken, refreshToken, extraParams, profile, done) {
    const db = app.get('db');
    console.log(`logged in: ${profile}`);
    return done(null, profile);
}));

app.get('/auth0', passport.authenticate('auth0'));
app.get(config.auth0.callbackURL, passport.authenticate('auth0', {successRedirect: 'http://localhost:3000/dashboard'}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
app.get('/auth0/logout', function(req, res) {
  req.logout();
  res.redirect('http://localhost:3000/');
})


// ENDPOINTS
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/api/user/:id', mainCtrl.getUser)


app.get('/api/group/:id', mainCtrl.getGroup)
app.get('/api/project/:id', mainCtrl.getProject)

app.post('/api/newuser', mainCtrl.addUser)
app.post('/api/newgroup', mainCtrl.addGroup)
app.post('/api/newproject/:groupid', mainCtrl.addProject)

// LISTEN
const io = socket(app.listen(config.port, () => console.log(`Server listening on port ${config.port}`)))

// SOCKETS
io.on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});