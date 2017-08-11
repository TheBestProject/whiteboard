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
const mainCtrl = require('./mainCtrl');

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
app.get('/api/user/:id', mainCtrl.getUser) // working id param targets user id
app.get('/api/inituser/:id', mainCtrl.getAllUser) //working id param targets user id
app.get('/api/initdata/:id', mainCtrl.getInitialData) //working id param targets users.id
app.get('/api/group/:id', mainCtrl.getGroup) //working id param targets group id
app.get('/api/project/:id', mainCtrl.getProject) //working id param targets project id
app.get('/api/group/members/:id', mainCtrl.getGroupMembers) //working id param targets group id
app.get('/api/project/members/:id', mainCtrl.getProjectMembers) //working id param targets project id


app.post('/api/new/user', mainCtrl.addUser) //need auth0 formatted data to finish
app.post('/api/new/group', mainCtrl.addGroup) //working provide "name"
app.post('/api/new/project/:id', mainCtrl.addProject) //working id param targets the group to connect project to
app.post('/api/new/whiteboard/:id', mainCtrl.addWhiteboard) //working id params targets project id to connect whiteboard  to

// app.put('/api/update/user/:id', mainCtrl.updateUser) //PLACEHOLDER
app.put('/api/update/group/:id', mainCtrl.updateGroup) //working id param targets group id to update -- provide "name"
app.put('/api/update/project/:id', mainCtrl.updateProject) //working id param targets project id to update provide "name"
app.put('/api/update/whiteboard/:id', mainCtrl.updateWhiteboard) //working id param target whiteboard id to provide update to "name"
app.put('/api/update/canvas/:id', mainCtrl.updateWhiteboardData) //working id param tagets whiteboard id to provide update to "canvas"

app.delete('/api/delete/group/:id', mainCtrl.deleteGroup) // working id param targets group id to delete and cascade
app.delete('/api/delete/project/:id', mainCtrl.deleteProject) //working id param targets project id to delete and cascade
app.delete('/api/delete/whiteboard/:id', mainCtrl.deleteWhiteboard) //working, id param targets whiteboard id

// LISTEN
const io = socket(app.listen(config.port, () => console.log(`Server listening on port ${config.port}`)))

// SOCKETS
io.on('connection', socket => {
  console.log('a user connected');
  socket.on('join', data => {
    socket.join(data.boardId);
    console.log('joined a room', data.boardId);
    const db = app.get('db');
    db.getBoard([data.boardId]).then(dbData => {
      io.to(data.boardId).emit('receiveCanvas', {URL: dbData[0]});
    })
    
  })
  socket.on('new canvas data', data => {
    io.to(data.boardId).emit('receiveCanvas', {URL: data.URL})
  })
  socket.on('leave', data => {
    socket.leave(data.boardId);
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});