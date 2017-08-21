// REQUIRE PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const socket = require('socket.io');
const path = require('path');
const port = process.env.PORT || '80';
const dummy = [[{
    color: "#444444",
    end:{x:70, y:207.63999938964844},
    fill: "",
    id: "26d1131a-67e5-47bb-8842-0b97316ff269",
    size: 2,
    start:{x:44,y:77.6399993864844},
    tool: 'ellipse'
}],[{color: "#444444",
    end:{x:647, y:364},
    fill: "#800080",
    id: "410cd1bb-44fb-4d21-bfbc-667096241ccc",
    size: 2,
    start:{x:187,y:146},
    tool: 'ellipse'}]]

// REQUIRE LOCAL FILES
// const config = require('./../config');
const mainCtrl = require('./server/mainCtrl');

// INVOKE EXPRESS AND SET UP MIDDLEWARE
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + './build'));


// DATABASE CONNECTION
massive(process.env.DATABASE_URL)
.then( db => {
    app.set('db', db);
    console.log('successful db hookup')

    passport.use(new Auth0Strategy({
      domain: process.env.authdomain,
      clientID: process.env.authclientID,
      clientSecret: process.env.authclientSecret,
      callbackURL: process.env.authcallbackURL
      },
  
        function(accessToken,refreshToken,extraParams,profile,done){
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
          const {name,email,picture} = profile._json;
          //calls to database
          const auth0_id = profile.identities[0].user_id;
          
          db.checkUser([auth0_id]).then((user)=>{
            if (user[0]){
              done(null,user[0])
            } else {
              console.log(auth0_id,name,email,picture)
              db.addNewUser([auth0_id,name,email,picture])
              .then((user)=>{
              console.log('user',user[0]);				
              done(null,user[0])
              })
            }
          })
        }
      )
    );
  
  }).catch( err => console.log(err));

// SESSIONS & AUTH0 & PASSPORT
app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 14}
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
  domain: process.env.authdomain,
  clientID: process.env.authclientID,
  clientSecret: process.env.authclientSecret,
  callbackURL: process.env.authcallbackURL
}, function(accessToken, refreshToken, extraParams, profile, done) {
    const db = app.get('db');
    console.log(`logged in: ${profile}`);
    return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  console.log('serializing', user);  
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //console.log('serializing', user); //this is the user that's passed through from done  
  done(null, user);
});

app.get('/auth0', passport.authenticate('auth0'));

app.get(process.env.authcallbackURL, passport.authenticate('auth0', {successRedirect: '/dashboard'}));

app.get('/auth0/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})  


// ENDPOINTS
app.get('/api/checkuser', mainCtrl.bcheckUser);
app.get('/api/groups/:userId', mainCtrl.bgetGroups);
app.get('/api/projects/:userId', mainCtrl.bgetProjects);
app.get('/api/boards/:userId', mainCtrl.bgetBoards);
app.get('/api/allusers', mainCtrl.bgetAllUsers);

app.get('/api/user', mainCtrl.getUser) // working id param targets user id
// app.get('/api/inituser/:id', mainCtrl.getAllUser) //working id param targets user id
// app.get('/api/initdata/:id', mainCtrl.getInitialData) //working id param targets users.id
app.get('/api/group/:id', mainCtrl.getGroup) //working id param targets group id
app.get('/api/project/:id', mainCtrl.getProject) //working id param targets project id
app.get('/api/group/members/:id', mainCtrl.getGroupMembers) //working id param targets group id
app.get('/api/project/members/:id', mainCtrl.getProjectMembers) //working id param targets project id
app.get('/api/board/:id', mainCtrl.getBoard)

app.post('/api/new/groupmember/:groupid', mainCtrl.baddGroupMember);
app.post('/api/new/projectmember/:projectid', mainCtrl.baddProjectMember);

app.post('/api/new/user', mainCtrl.addUser) //need auth0 formatted data to finish
app.post('/api/new/group', mainCtrl.addGroup) //working provide "name"
app.post('/api/new/project/:id', mainCtrl.addProject) //working id param targets the group to connect project to
app.post('/api/new/whiteboard/:id', mainCtrl.addWhiteboard) //working id params targets project id to connect whiteboard  to

app.put('/api/update/group/:groupid', mainCtrl.bupdateGroup);
app.put('/api/update/project/:projectid', mainCtrl.bupdateProject);
app.put('/api/update/boardthumbnail/:boardid', mainCtrl.bupdateBoardThumbnail);

app.put('/api/update/user/:id', mainCtrl.updateUser)
// app.put('/api/update/group/:id', mainCtrl.updateGroup) //working id param targets group id to update -- provide "name"
// app.put('/api/update/project/:id', mainCtrl.updateProject) //working id param targets project id to update provide "name"
app.put('/api/update/boardname/:id', mainCtrl.updateWhiteboard) //working id param target whiteboard id to provide update to "name"
app.put('/api/update/boarddata/:id', mainCtrl.updateWhiteboardData) //working id param tagets whiteboard id to provide update to "canvas"

app.delete('/api/delete/group/:id', mainCtrl.deleteGroup) // working id param targets group id to delete and cascade
app.delete('/api/delete/project/:id', mainCtrl.deleteProject) //working id param targets project id to delete and cascade
app.delete('/api/delete/whiteboard/:id', mainCtrl.deleteWhiteboard) //working, id param targets whiteboard id

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './build/index.html')));

// LISTEN
const io = socket(app.listen(port, () => console.log(`Server listening on port ${port}`)))

// // SOCKETS
io.on('connection', socket => {
  console.log('a user connected');
  socket.on('join', data => {
    socket.join(data.boardId);
    console.log('joined a room', data.boardId);
    const db = app.get('db');
    db.getBoardData([data.boardId]).then(dbData => {
      // let temp = JSON.parse(dbData[0].image_data)
      // console.log(dbData[0].image_data);
      io.to(data.boardId).emit('receive image array', {items: dbData[0].image_data});
    })
  })
  socket.on('new canvas item', data => {
    const db = app.get('db');
    db.getBoardData([data.boardId]).then(dbData => {
      let oldImage = dbData[0].image_data;
      // console.log('oldimage', oldImage); 
      let tempArr = [];
      tempArr.push(data.item)
      // console.log('new Item', data.item);
      oldImage.push(tempArr);
      // console.log('newimage', oldImage);
      let temp = JSON.stringify(oldImage);
      db.updateWhiteboardData([temp, data.boardId]).then(dbData2 => {
        io.to(data.boardId).emit('receive image item', {item: data.item})
      })
    })
    // console.log('new canvas data reached the server', data.item);
  })
  socket.on('new canvas array', data => {
    const db = app.get('db');
    // console.log('new canvas received')
    let temp = JSON.stringify(data.items);
    db.updateWhiteboardData([temp, data.boardId]).then(dbData => {
      io.to(data.boardId).emit('receive image array', {items: dbData[0].image_data});
    })
  })
  socket.on('leave', data => {
    console.log('now leaving', data.boardId);
    socket.leave(data.boardId);
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});