const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, __dirname),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.get("/", (req, res) => {
  let images = [];
  if (fs.existsSync("data.json")) {
    images = JSON.parse(fs.readFileSync("data.json"));
  }
  res.render("index", { images });
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.array("images"), (req, res) => {
  let images = fs.existsSync("data.json")
    ? JSON.parse(fs.readFileSync("data.json"))
    : [];

  req.files.forEach((file) => {
    images.push({
      filename: file.filename,
      originalname: file.originalname,
      uploadDate: new Date().toISOString(),
    });
  });

  fs.writeFileSync("data.json", JSON.stringify(images, null, 2));
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
