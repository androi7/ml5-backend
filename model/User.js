const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    name: {
      type: String,
      required: true
    } //,
    // id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true
    // }
  },

},
{
  timestamps: true  // createdAt, updatedAt
});

MessageSchema.methods.getTime = () => {
  const currentTime = Math.floor(new Date() / 1000);
  const pastTime = Math.floor(this.createdAt / 1000);
  const elapsedTime = currentTime - pastTime;

  let output = '';

  if (elapsedTime < 60) {
    output = `${elapsed} seconds ago`;
  } else if (elapsedTime < 3600) {
    output = `${elaspedTime / 60 } minutes ago`
  } else if (elapsedTime < 86400) { // 60*60*24
    output = `${elapsedTime / 1440} hours ago`  // 60 * 24
  } else {
    output = `${Math.floor(elapsedTime /  86400)} days ago`;
  }
  return output;
};

const ChatSchema = mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Message'
  }]
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // friends: [{
  //     name: String,
  //     id: mongoose.Schema.Types.ObjectId,
  //     online: Boolean,
  //     chat: [MessageSchema]
  // }],
  chats: [ChatSchema],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// module.exports = mongoose.model("User", UserSchema);

module.exports = {
  user: mongoose.model("User", UserSchema),
  message: mongoose.model("Message", MessageSchema),
  chat: mongoose.model("Chat", ChatSchema)
};
