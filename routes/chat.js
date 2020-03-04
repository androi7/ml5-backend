const express = require('express');
const auth = require("../middleware/auth");

const models = require("../models/User");
const User = models.user;
const router = express.Router();
let socketToClose;

router.get('/participants', async (req, res) => {  // token not sent, there auth not possible // auth
  console.log('participants route!');
  const userList = [];
  await User.find({}).exec()
    .then(result => {
      result.forEach(u => {
        //console.log('u', u);
        userList.push({name: u.username, id: u._id});
      });
    })
    .catch(err => console.warn(err)); // User.find()

  // userList.push({name: 'test', id: '1'});
  res.status(200).json(userList);
});

router.post('/public', auth,  async (req, res) => {
    //req.app.get('io')
    io.on('connection', socket => {
        socketToClose = socket;
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

        socket.emit('welcome', {
          message: `Welcome ${req.user.username}`,
          user: req.user.username
        });  // emit an event to the socket
    });
});


router.post('/private',  async (req, res) => {

  const { recipient_id, sender_id } = req.body;

  const ids = [
    recipient_id,
    sender_id
  ]

  const roomName = ids.sort().toString();

  // io.on('connection', socket => {
  //   socket.join('/private').on('message', data => {
  //     const message = data.message;
  //     const user = data.user;
  //
  //     io.to('/private').emit('all messages', {
  //       message: message,
  //       user: user
  //     });
  //   });
  // });

  // User.find().where('_id').in(ids).exec()
  //   .then(res => {
  //       const io = require('socket.io')(server);
  //       io.on('connection', socket => {
  //         socket.on(roomName, (room) => {
  //           socket.join(room);
  //         });
  //       });
  //   });

});

module.exports = router;
