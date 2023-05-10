const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const convertAudio = require("../convert");

const mapCheckInQueueLoading = new Map();
const historyCheck = new Map();
const urlAudio = "https://audioplatform.onrender.com";

module.exports.getStreamAudioMp3 = (req, res, next) => {
  const musicPath = req.params.musicPath;
  const musicId = req.params.musicPath.split(".")[0];
  console.log(musicPath);

  const stream = ytdl(`https://www.youtube.com/watch?v=${musicId}`, {
    filter: "audioonly",
    quality: "highestaudio",
  });

  res.set({
    "Content-Type": "audio/mpeg",
    "Transfer-Encoding": "chunked",
  });

  stream.pipe(res);
  stream.on("end", () => {
    console.log("end");
  });
};

module.exports.getConvertAudio = (req, res, next) => {
  const startTime = Date.now();
  const musicPath = req.params.musicPath;
  const musicId = req.params.musicPath.split(".")[0];
  const format = req.params.musicPath.split(".")[1];
  console.log(musicPath);

  // nếu musicPath đang load thì trả về đang load
  if (mapCheckInQueueLoading.has(musicPath))
    return res.send({
      result: {
        time: (Date.now() - startTime) / 1000,
        message: "same music path in queue, please recheck later",
        warning: true,
        url: `${urlAudio}/musics/${musicPath}`,
      },
    });

  mapCheckInQueueLoading.set(musicPath, true);
  const stream = ytdl(`https://www.youtube.com/watch?v=${musicId}`, {
    filter: "audioonly",
    quality: "highestaudio",
  });

  stream.pipe(
    fs.createWriteStream(path.join(__dirname, "..", "musics", musicId + ".mp3"))
  );

  stream.on("error", (err) => {
    console.log(err);
  });

  // sau khi stream hoàn thành thì chuyển đổi sang dạng tương ứng
  stream.on("end", () => {
    console.log("end");
    const startConvert = Date.now();
    stream.destroy();

    convertAudio(musicId + ".mp3", musicPath, (err) => {
      mapCheckInQueueLoading.delete(musicPath);
      if (err)
        return res.send({
          error: { err, time: (Date.now() - startTime) / 1000 },
        });

      historyCheck.set(format, [
        ...(historyCheck.get(format) || []),
        {
          time: (Date.now() - startTime) / 1000,
          timeConvert: (Date.now() - startConvert) / 1000,
          musicId,
        },
      ]);
      res.send({
        result: {
          time: (Date.now() - startTime) / 1000,
          timeConvert: (Date.now() - startConvert) / 1000,
          message: "converted",
          url: `${urlAudio}/musics/${musicPath}`,
        },
      });
    });
  });
};

module.exports.getHistory = (req, res, next) => {
  console.log("his");
  let data = [];
  historyCheck.forEach((value, key) => {
    data.push({ format: key, info: value });
  });
  res.send({
    result: { data },
  });
};
