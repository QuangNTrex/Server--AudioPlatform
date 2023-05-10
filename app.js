const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

const MusicRouter = require("./routers/music");

app.use("/music", MusicRouter);

app.use("/musics", express.static(path.join(__dirname, "musics")));

app.use("/test", (req, res, next) => {
  res.send({ result: { text: "oke" } });
});

app.listen(8888, () => {
  console.log("connected!");
});
