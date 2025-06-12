const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { usersCol, notesCol, notesGroupCol } = require("../db/dbconnection");
const crypto = require("crypto");
const { memoryUsage } = require("process");
const fileUpload = require("express-fileupload");

router.use(
  fileUpload({
    useTempFiles: false, // Don't create temp files
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    abortOnLimit: true,
  })
);

// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});



router.get("/getInfo", async (req, res) => {
  res.send(
    await usersCol.findOne({
      uuid: jwt.decode(req.cookies._uid, process.env.SIGNING_CODE)
        .loggedinUserUUID,
    })
  );
});
router.get("/getName", async (req, res) => {
  res.send(jwt.decode(req.cookies._uid).userName);
});

router.put("/updateProfileImageGravatar", async (req, res) => {
  const hashedEmail = crypto
    .createHash("sha256")
    .update(req.user.loggedUserEmail)
    .digest("hex");
  await fetch(`https://api.gravatar.com/v3/profiles/${hashedEmail}`, {
    headers: {
      Authorization: `Bearer ${process.env.GRAVTAR_API}`,
    },
  })
    .then((response) => {
      switch (response.status) {
        case 404:
          res.sendStatus(404);
          return;
        case 200:
          return response.json();
      }
    })
    .then((response) => {
      if (response) {
        usersCol.updateOne(
          { uuid: req.user.loggedinUserUUID },
          { $set: { pfp: response.avatar_url } }
        );
        res.send(response.avatar_url);
      }
    });
});

router.put("/updateProfileImageUpload", async (req, res) => {
  try {
    // Validate file exists
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageFile = req.files.image;

    // Validate file content
    if (!imageFile.data || imageFile.data.length === 0) {
      return res.status(400).json({ error: "Empty file received" });
    }

    // Convert to base64 for Cloudinary
    const base64Image = `data:${
      imageFile.mimetype
    };base64,${imageFile.data.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "PFPs",
      transformation:{aspect_ratio: "1:1", gravity: "auto", crop: "auto", quality: "auto"},
      public_id: `pfp-${req.user.loggedinUserUUID}`,
      overwrite: true,
      resource_type: "auto",
    });

    await usersCol.updateOne(
      { uuid: req.user.loggedinUserUUID },
      { $set: { pfp: uploadResult.secure_url } }
    );

    res.json({
      success: true,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({
      error: "File upload failed",
      details: error.message,
    });
  }
});

router.delete("/resetAccount", async (req, res) => {
  try {
    notesGroupCol.deleteMany({ ownerID: req.user.loggedinUserUUID });
    notesCol.deleteMany({ ownerID: req.user.loggedinUserUUID });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.delete("/deleteAccount", async (req, res) => {
  try {
    notesGroupCol.deleteMany({ ownerID: req.user.loggedinUserUUID });
    notesCol.deleteMany({ ownerID: req.user.loggedinUserUUID });
    usersCol.deleteOne({ uuid: req.user.loggedinUserUUID });

    res
      .clearCookie("_uid", {
        secure: true,
        sameSite: "none",
      })
      .sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
