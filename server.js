const express = require('express');
const cors = require('cors');
const InitiateMongoServer = require('./config/db');
require('dotenv').config({ path: './config/variables.env' });


const user = require("./routes/user");
const chat = require("./routes/chat");
const video = require("./routes/video");

InitiateMongoServer();


// const models = require("./models/User");
// const User = models.user;

const app = express();
const server = require('http').Server(app);

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({limit: '10mb', extended: true}));
app.use(express.urlencoded({limit: '10mb', extended: true}));

app.get("/", (req, res) => {
  res.json({message: "Welcome"});
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
*/

app.use("/user", user);
app.use("/chat", chat);
app.use("/video", video);


// Fallback route handler
app.use((req, res) => {
  res.sendStatus(404);
});

server.listen(PORT, (req, res) => {
  console.log(`Server is listening on PORT ${PORT}`);
});

const io = require('socket.io')(server);
app.set('io', io);

// io.on('connection', socket => {
//
//     socket.on('message', data => {
//       const message = data.message;
//       const user = data.user;
//
//       io.emit('all messages', {
//         message: message,
//         user: user
//       }); // io.emit('all messages')
//     }); // socket.on('message')
//
//     socket.emit('request', {
//       welcome: `Welcome`
//     });  // emit an event to the socket
//
//     // io.emit('welcome', {
//     //   newUser: 'joined!'
//     // }
//     // );
//
//     // io.emit('joined', { // emit an event to all connected sockets, broadcast
//     //   content: `User ${user.username} joined the chat.`,
//     // });
//
// });

io.on('connection', socket => {
    socket.on('message', data => {
      const message = data.message;
      const user = data.user;
      console.log('message when receiving on server:', message);

      //socket.broadcast
      io.emit('all messages', {
        message: message,
        user: user
      }); // io.emit('all messages')
    }); // socket.on('message')
});
