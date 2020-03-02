const express = require('express');
const auth = require("../middleware/auth");

const models = require("../models/User");
const User = models.user;
const router = express.Router();

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

router.post('/room', async (req, res) => {

  const { recipient_id, sender_id } = req.body;

  const ids = [
    recipient_id,
    sender_id
  ]

  const roomName = ids.sort().toString();
  const app = express();

  User.find().where('_id').in(ids).exec()
    .then(res => {
        const io = require('socket.io')(server);
        io.on('connection', socket => {
          socket.on(roomName, (room) => {
            socket.join(room);
          });
        });
    });

});

module.exports = router;
