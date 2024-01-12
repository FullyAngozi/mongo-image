const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Image = require('./imageModal')
require("dotenv").config();

const app = express();
app.use(cors());

app.use('/images', express.static('images'))


const port = process.env.PORT || 3000
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // or use any logic to generate the filename
  },
});

const uploads = multer({ storage: storage });

const MONGOString = process.env.MONGODB_URL;
mongoose.connect(MONGOString);
const mongodb = mongoose.connection;

mongodb.on("error", console.error.bind(console, "MongoDB connection error:"));
mongodb.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.json("We're running on port 3000");
  res.setHeader('Content-Type', 'application/javascript');
});

app.get('/randomImage', async (req, res) => {
  try {
    const randomImage = await Image.aggregate([{ $sample: { size: 1 } }]);

    if (!randomImage || randomImage.length === 0) {
      return res.status(404).json({ error: 'No images found' });
    }

    res.json(randomImage[0]);
  } catch (error) {
    console.error('Error retrieving random image:', error);
    res.status(500).json({ error: error.message });
  }
});


app.post('/upload', uploads.single('image'), async (req, res) => {
    try {
        if (!req.file) {
          throw new Error('No file uploaded');
        }
    
        const { originalname, buffer, mimetype } = req.file;
        console.log(req.file)
    
        const newImage = new Image({
          name: originalname,
          data: buffer,
        });
    
        await newImage.save();
    
        res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
      } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: error.message });
      }
});

app.listen(port, () => {
  console.log("Serving on port 3000");
});
