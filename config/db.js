const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://admin1:admin1234@cluster0-ozbil.mongodb.net/test?retryWrites=true&w=majority"

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
