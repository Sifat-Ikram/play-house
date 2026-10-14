const { getImageKit } = require("../utils/imagekit");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const result = await getImageKit().upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/PlayHouse/admin",
    });

    return res.status(201).json({ success: true, data: { url: result.url } });
  } catch (error) {
    console.error("Upload error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Image upload failed" });
  }
};

module.exports = { uploadImage };
