const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://music-simple.web.app",
    ],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

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
