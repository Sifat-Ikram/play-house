const ImageKit = require("imagekit");

let client = null;

const getImageKit = () => {
  if (!client) {
    client = new ImageKit({
      publicKey: process.env.CLOUDINARY_CLOUD_NAME,
      privateKey: process.env.CLOUDINARY_API_KEY,
      urlEndpoint: process.env.CLOUDINARY_API_SECRET,
    });
  }
  return client;
};

module.exports = { getImageKit };
