const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const inputFile = "/musics/Dsi5uZxoy-E.mp3";
const musicInputFile = "Dsi5uZxoy-E.mp3";
const musicOutputFile = "Dsi5uZxoy-E.m4a";
const outputFile = "/musics";

exec(
  `ffmpeg -i ${__dirname.replace(/\\/g, "/") + `/musics/${musicInputFile}`} ${
    __dirname.replace(/\\/g, "/") + `/musics/${musicOutputFile}`
  }`,
  (err, std) => {
    console.log(err);
    console.log(std);
  }
);

console.log(__dirname, __dirname.replace(/\\/g, "/"));
console.log(
  `ffmpeg -i ${__dirname.replace(/\\/g, "/") + `/musics/${musicInputFile}`} ${
    __dirname.replace(/\\/g, "/") + `/musics/${musicOutputFile}`
  }`
);
