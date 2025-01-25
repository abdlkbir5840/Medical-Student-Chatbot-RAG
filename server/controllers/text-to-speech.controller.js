const { KokoroTTS } = require("kokoro-js");
const model_id = "onnx-community/Kokoro-82M-ONNX";

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const { exec } = require("child_process");

ffmpeg.setFfmpegPath(ffmpegPath);

// Convert WAV to MP3
async function convertWavToMp3(wavPath) {
  console.log("WAV file path: ", wavPath);
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(wavPath)) {
      return reject(new Error(`WAV file does not exist at path: ${wavPath}`));
    }

    const mp3Path = wavPath.replace(".wav", ".mp3");
    ffmpeg(wavPath)
      .output(mp3Path)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .on("end", () => resolve(mp3Path))
      .on("error", (err, stdout, stderr) => {
        console.error("FFmpeg error: ", err);
        console.error("FFmpeg stdout: ", stdout);
        console.error("FFmpeg stderr: ", stderr);
        reject(err);
      })
      .run();
  });
}

// Merge audio files using SoX
function mergeAudioFiles(audioPaths, outputPath) {
  return new Promise((resolve, reject) => {
    const soxCommand = `sox ${audioPaths.join(" ")} ${outputPath}`;

    exec(soxCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Error merging audio files: ${stderr || error.message}`);
      } else {
        resolve(outputPath);
      }
    });
  });
}

// Split text into chunks of a specific size
function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  let currentIndex = 0;
  while (currentIndex < text.length) {
    chunks.push(text.slice(currentIndex, currentIndex + chunkSize));
    currentIndex += chunkSize;
  }
  return chunks;
}

// Generate speech from text
async function generateSpeech(req, res) {
  const { text, voice = "af_bella" } = req.body;
  const chunkSize = 300; 
  let audioPaths = [];
  try {
    if (!text) {
      return res.status(400).send("Text is required for speech generation");
    }

    console.log("Load the TTS model");
    const tts = await KokoroTTS.from_pretrained(model_id, {
      dtype: "q8", // Option: "fp32", "fp16", "q8", "q4", "q4f16"
    });

    const textChunks = splitTextIntoChunks(text, chunkSize);

    console.log("Generate audio for each text chunk");
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      console.log(`Generating audio for chunk ${i + 1}/${textChunks.length}`);
      const audio = await tts.generate(chunk, { voice });
      const chunkName = `chunk_${uuidv4()}.wav`;
      const chunkPath = path.join(__dirname, "../data/audios", chunkName);
      await audio.save(chunkPath);
      audioPaths.push(chunkPath);
    }

    console.log("Merge audio files");
    const mergedAudioPath = path.join(__dirname, "../data/audios", `merged_${uuidv4()}.wav`);
    await mergeAudioFiles(audioPaths, mergedAudioPath);

    console.log("Convert merged WAV to MP3");
    // const mp3Path = await convertWavToMp3(mergedAudioPath);
    const mp3Path = mergedAudioPath.replace(".wav", ".mp3");
    const command = `ffmpeg -i "${mergedAudioPath}" -codec:a libmp3lame -b:a 128k "${mp3Path}"`;

    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", stderr || error.message);
          return reject(error);
        }
        console.log("FFmpeg stdout:", stdout);
        resolve();
      });
    });

    console.log("Set headers and send the MP3 file as a response");
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `inline; filename=output.mp3`);
    res.sendFile(mp3Path, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Failed to send the MP3 file.");
      } else {
        // Clean up the MP3 file after it's sent
        fs.unlinkSync(mp3Path);
      }
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send("Failed to generate speech: " + error.message);
  } finally {
    // Clean up temporary audio files
    audioPaths.forEach((chunkPath) => fs.unlinkSync(chunkPath));
    const mergedAudioPath = path.join(__dirname, "../data/audios", `merged_${uuidv4()}.wav`);
    if (fs.existsSync(mergedAudioPath)) {
      fs.unlinkSync(mergedAudioPath);
    }
  }
}


module.exports = { generateSpeech };
