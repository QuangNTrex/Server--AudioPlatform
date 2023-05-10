const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const convertAudio = require("../convert");

const mapCheckInQueueLoading = new Map();

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
  stream.on("data", () => {
    console.log("data");
  });
  stream.on("end", () => {
    console.log("end");
  });
};

module.exports.getConvertAudio = (req, res, next) => {
  const startTime = Date.now();
  const musicPath = req.params.musicPath;
  const musicId = req.params.musicPath.split(".")[0];
  console.log(musicPath);

  // nếu musicPath đang load thì trả về đang load
  if (mapCheckInQueueLoading.has(musicPath))
    return res.send({
      result: {
        time: (Date.now() - startTime) / 1000,
        message: "same music path in queue, please recheck later",
        url: `https://audio-only.onrender.com/musics/${musicPath}`,
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
    stream.destroy();

    convertAudio(musicId + ".mp3", musicPath, (err) => {
      mapCheckInQueueLoading.delete(musicPath);
      if (err)
        res.send({ error: { err, time: (Date.now() - startTime) / 1000 } });
      else
        res.send({
          result: {
            time: (Date.now() - startTime) / 1000,
            message: "converted",
            url: `https://audio-only.onrender.com/musics/${musicPath}`,
          },
        });
    });
  });
};
