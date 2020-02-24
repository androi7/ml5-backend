const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }
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

module.exports = mongoose.model('Message', MessageSchema);
