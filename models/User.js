const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const messageSchema = mongoose.Schema({
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

messageSchema.methods.getTime = () => {
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

const chatSchema = mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  images: [
    {
      type: String,
    }
  ],
  // friends: [{
  //     name: String,
  //     id: mongoose.Schema.Types.ObjectId,
  //     online: Boolean,
  //     chat: [MessageSchema]
  // }],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// hash for seed files
const saltRounds = 10;
userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, saltRounds);
  console.log('bycrypted', this.password);
  next();
});

module.exports = {
  user: mongoose.model("User", userSchema),
  message: mongoose.model("Message", messageSchema),
  chat: mongoose.model("Chat", chatSchema)
};
