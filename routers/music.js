const router = require("express").Router();
const MusicController = require("../controllers/music");

router.use("/mp3/:musicPath", MusicController.getStreamAudioMp3);

router.use("/music-check/:musicPath", MusicController.getConvertAudio);

module.exports = router;
