// const { KokoroTTS } = require("kokoro-js");
// const model_id = "onnx-community/Kokoro-82M-ONNX";

// const fs = require("fs");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const ffmpeg = require("fluent-ffmpeg");
// const ffmpegPath = require("ffmpeg-static");

// ffmpeg.setFfmpegPath(ffmpegPath);

// async function convertWavToMp3(wavPath) {
//   return new Promise((resolve, reject) => {
//     const mp3Path = wavPath.replace(".wav", ".mp3");

//     ffmpeg(wavPath)
//       .output(mp3Path)
//       .audioCodec("libmp3lame")
//       .audioBitrate(128)
//       .on("end", () => resolve(mp3Path))
//       .on("error", (err) => reject(err))
//       .run();
//   });
// }


// async function generateSpeech(req, res) {
//   const { text, voice = "af_bella" } = req.body;

//   try {
//     if (!text) {
//       return res.status(400).send("Text is required for speech generation");
//     }

//     const tts = await KokoroTTS.from_pretrained(model_id, {
//       dtype: "q8", // Option: "fp32", "fp16", "q8", "q4", "q4f16"
//     });
//     const audio = await tts.generate(text, { voice });
//     const audioName = uuidv4() + ".wav";
//     const audioPath = path.join(__dirname, "../data/audios",audioName);
//     await audio.save(audioPath);

//     const mp3Path = await convertWavToMp3(audioPath);

//     const rawAudio = audio.audio; 
//     const buffer = Buffer.from(rawAudio.buffer);
//     res.setHeader("Content-Type", "audio/mp3");
//     res.setHeader("Content-Disposition", `inline; filename=${audioName}`);
//     res.sendFile(mp3Path, () => {
//       fs.unlinkSync(mp3Path);
//     });

//   } catch (error) {
//     console.error("Error generating speech:", error);
//     res.status(500).send("Failed to generate speech: " + error.message);
//   }
// }

// module.exports = { generateSpeech };
const { KokoroTTS } = require("kokoro-js");
const model_id = "onnx-community/Kokoro-82M-ONNX";

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

async function convertWavToMp3(wavPath) {
  return new Promise((resolve, reject) => {
    const mp3Path = wavPath.replace(".wav", ".mp3");
    ffmpeg(wavPath)
      .output(mp3Path)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .on("end", () => resolve(mp3Path))
      .on("error", (err) => reject(err))
      .run();
  });
}

function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  let currentIndex = 0;
  while (currentIndex < text.length) {
    chunks.push(text.slice(currentIndex, currentIndex + chunkSize));
    currentIndex += chunkSize;
  }
  return chunks;
}

async function generateSpeech(req, res) {
  const { text, voice = "af_bella" } = req.body;
  const chunkSize = 300; // Maximum characters per chunk

  try {
    if (!text) {
      return res.status(400).send("Text is required for speech generation");
    }

    const tts = await KokoroTTS.from_pretrained(model_id, {
      dtype: "q8", // Option: "fp32", "fp16", "q8", "q4", "q4f16"
    });

    const textChunks = splitTextIntoChunks(text, chunkSize);
    const audioPaths = [];

    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      console.log(`Generating audio for chunk ${i + 1}/${textChunks.length}`);
      const audio = await tts.generate(chunk, { voice });
      const chunkName = `chunk_${uuidv4()}.wav`;
      const chunkPath = path.join(__dirname, "../data/audios", chunkName);
      await audio.save(chunkPath);
      audioPaths.push(chunkPath);
    }

    const mergedAudioPath = path.join(__dirname, "../data/audios", `merged_${uuidv4()}.wav`);
    const soxCommand = `sox ${audioPaths.join(" ")} ${mergedAudioPath}`;
    const exec = require("child_process").execSync;
    exec(soxCommand);

    audioPaths.forEach((chunkPath) => fs.unlinkSync(chunkPath));

    const mp3Path = await convertWavToMp3(mergedAudioPath);

    fs.unlinkSync(mergedAudioPath);

    res.setHeader("Content-Type", "audio/mp3");
    res.setHeader("Content-Disposition", `inline; filename=output.mp3`);
    res.sendFile(mp3Path, () => {
      fs.unlinkSync(mp3Path);
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send("Failed to generate speech: " + error.message);
  }
}

module.exports = { generateSpeech };
