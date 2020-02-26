const express = require('express');
const auth = require("../middleware/auth");

const models = require("../models/User");
const User = models.user;©
const router = express.Router();

router.get('/participants', auth, async (req, res) => {
  const userList = [];
  await User.find({}).exec()
    .then(result => {
      result.forEach(u => {
        console.log('u', u);
        userList.push({name: u.username, id: u._id});
      });
    })
    .catch(err => console.warn(err)); // User.find()

  // userList.push({name: 'test', id: '1'});
  res.status(200).json(userList);
});

module.exports = router;
