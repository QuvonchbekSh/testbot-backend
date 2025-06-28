const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/files", express.static(path.join(__dirname, "files")));

app.post("/api/generate", (req, res) => {
  const { userId, question, options } = req.body;
  const fileName = `test-${userId}-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "files", fileName);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(16).text(`Savol: ${question}`);
  options.forEach((opt, i) => {
    doc.text(`${String.fromCharCode(65 + i)}. ${opt}`);
  });
  doc.end();

  res.json({ pdf: `http://localhost:5000/files/${fileName}` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
