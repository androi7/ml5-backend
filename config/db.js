const mongoose = require('mongoose');

const MONGO_URI = "mongodb://127.0.0.1:27017/node-auth"

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Connected to DB!');
  } catch (e) {
    console.log('No connection to DB', e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
