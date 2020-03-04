const express = require('express');
const auth = require("../middleware/auth");
const cloudinary = require('cloudinary');
// middleware for parsing uploaded files
const multipart = require('connect-multiparty');
const saveImage = require('../middleware/saveImage');

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

router.post('/upload', [auth, multipartMiddleware, saveImage], async (req, res) => {
  try{
    // save image name to DB for fetching later
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: {
          images: req.image
        }
      }
    );
  } catch(err) {
    console.error('Failed upload to cloudinary:', err);
  }
});


router.get('/images', auth, async (req, res) => { // /:page
  try {
    const user = await User.findById(req.user.id);
    // const { page } = req.params;
    // const imagesPerPage = 10;
    // if (user.images.length > 0) {
    //   const images = user.images.sort().slice((page - 1) * imagesPerPage, page * (imagesPerPage - 1));
    // }
    const images = user.images;
    res.json(images);
  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
