const express = require('express');

// const bodyParser = require('body-parser');
const user = require("./routes/user");
const chat = require("./routes/chat");
const InitiateMongoServer = require('./config/db');
const cors = require('cors');

InitiateMongoServer();

const Models = require("./model/User");
const User = Models.user;
// const User = require("./model/User");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({message: "API Working"});
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
*/

app.use("/user", user);
// app.use("/chat", chat);

app.use("/chat", chat);

// Fallback route handler
app.use((req, res) => {
  res.sendStatus(404);
});

const server = app.listen(PORT, (req, res) => {
  console.log(`Server is listening on PORT ${PORT}`);
});

const io = require('socket.io')(server);

//.of('/chatroom')
io.on('connection', socket => {



    socket.on('message', data => {
      const message = data.message;
      const user = data.user;

      io.emit('all messages', {
        message: message,
        user: user
      }); // io.emit('all messages')

    }); // socket.on('message')



    socket.emit('request', {
      welcome: `Welcome`
    });  // emit an event to the socket

    // io.emit('welcome', {
    //   newUser: 'joined!'
    // }
    // );




    // io.emit('joined', { // emit an event to all connected sockets, broadcast
    //   content: `User ${user.username} joined the chat.`,
    // });

});
