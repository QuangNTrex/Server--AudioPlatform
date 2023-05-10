const { exec } = require("child_process");

function convertAudio(mp3File, m4aFile, cb) {
  if (mp3File === m4aFile) return cb(null);
  exec(
    `ffmpeg -i ${__dirname.replace(/\\/g, "/") + `/musics/${mp3File}`} ${
      __dirname.replace(/\\/g, "/") + `/musics/${m4aFile}`
    }`,
    (err) => {
      cb(err);
    }
  );
}

module.exports = convertAudio;
