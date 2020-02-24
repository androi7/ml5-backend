const InitiateMongoServer = require('./config/db');
InitiateMongoServer();

const Models = require('./model/User');
const User = Models.user;
const Chat = Models.chat;
const Message = Models.message;

User.collection.drop();
Chat.collection.drop();
Message.collection.drop();

const user1 = new User({
  username: 'User1',
  email:    'user1@email.com',
  password: 'Chicken1',
  passwordConfirmation: 'Chicken1',
});

const user2 = new User({
  username: 'User2',
  email:    'user2@email.com',
  password: 'Chicken1',
  passwordConfirmation: 'Chicken1',
});

const user3 = new User({
  username: 'User3',
  email:    'user3@email.com',
  password: 'Chicken1',
  passwordConfirmation: 'Chicken1',
});

const user4 = new User({
  username: 'User4',
  email:    'user4@email.com',
  password: 'Chicken1',
  passwordConfirmation: 'Chicken1',
});

user1.save();
user2.save();
user3.save();
user4.save((err) => {
  User.find({}, (err, users) => {
    console.log(`Users (should/be): (4/${users.length})`);
  });
});



const message1 = new Message({
  text: "a",
  author: {
    name: "user1"
  }
});

const message2 = new Message({
  text: "b",
  author: {
    name: "user1"
  }
});

const message3 = new Message({
  text: "c",
  author: {
    name: "user1"
  }
});

const message4 = new Message({
  text: "d",
  author: {
    name: "user1"
  }
});

const message5 = new Message({
  text: "e",
  author: {
    name: "user2"
  }
});

const message6 = new Message({
  text: "f",
  author: {
    name: "user2"
  }
});

const message7 = new Message({
  text: "g",
  author: {
    name: "user2"
  }
});

const message8 = new Message({
  text: "h",
  author: {
    name: "user3"
  }
});

const message9 = new Message({
  text: "i",
  author: {
    name: "user3"
  }
});

const message10 = new Message({
  text: "j",
  author: {
    name: "user3"
  }
});

const message11 = new Message({
  text: "k",
  author: {
    name: "user4"
  }
});

const message12 = new Message({
  text: "l",
  author: {
    name: "user4"
  }
});

message1.save();
message2.save();
message3.save();
message4.save();
message5.save();
message6.save();
message7.save();
message8.save();
message9.save();
message10.save();
message11.save();
message12.save((err) => {
  Message.find({}, (err, messages) => {
    console.log(`Messages (should/be): (12/${messages.length})`);
  });
});




const chat1 = new Chat({
  participants: [user1._id, user2._id],
  messages: [message1._id, message5._id, message2._id, message6._id]
});

const chat2 = new Chat({
  participants: [user1._id, user3._id],
  messages: [message3._id, message8._id, message9._id, message4._id]
});



// const chat3 = Chat.create({
//   participants: [user2._id, user3._id],
//   messages: []
// });
//
// const chat4 = Chat.create({
//   participants: [user3._id, user4._id],
//   messages: []
// });

chat1.save();
chat2.save((err) => {
  Chat.find({}, (err, chats) => {
    console.log(`Chats (should/be): (2/${chats.length})`);
  })
});

Chat.find({})
  .populate('participants')
  .populate('messages')
  .exec((err, chats) => {
    console.log(JSON.stringify(chats));
  });
