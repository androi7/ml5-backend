const express = require('express');
const auth = require("../middleware/auth");
const cloudinary = require('cloudinary');
// middleware for parsing uploaded files
const multipart = require('connect-multiparty');

const models = require("../models/User");
const User = models.user;
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup multiparty
const multipartMiddleware = multipart();

router.post('/upload', multipartMiddleware, async (req, res) => {
  try{
    // Upload image to cloudinary
    await cloudinary.v2.uploader.upload(req.body.file, {}, function(
      error,
      result
    ) {
      if (error) {
        return res.status(500).send(error);
      }

      res.json(result);
    });
  } catch(err) {
    console.error('Failed upload to cloudinary:', err);
  }
});

module.exports = router;
