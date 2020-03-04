const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


module.exports = async (req, res, next) => {
  try {
    // Upload image to cloudinary
    await cloudinary.v2.uploader.upload(
      req.body.file,
      {},
      function(error, result) {
        if (error) {
          return res.status(500).send(error);
        }

        req.image = result.secure_url;
        res.json(result);
      }
    );

    next();
  } catch(err) {
    console.log(err);
    res.status(400).json({ msg: 'Error while uploading image' });
  }
};
