const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const cors = require('cors');

const app = express();

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

app.post('/upload', upload.single('docxFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const docxBuffer = req.file.buffer;
    const result = await mammoth.extractRawText({ buffer: docxBuffer });
    const extractedText = result.value;

    res.json({ text: extractedText });
  } catch (error) {
    console.error('Error while processing the DOCX file:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = app;
