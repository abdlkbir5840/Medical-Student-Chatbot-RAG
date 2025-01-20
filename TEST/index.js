const { KokoroTTS } = require("kokoro-js");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const model_id = "onnx-community/Kokoro-82M-ONNX";
const chunkSize = 300; // Adjust based on the model's character limit

async function generateSpeechChunked(text, voice = "af_bella") {
  try {
    if (!text) {
      throw new Error("Text is required for speech generation");
    }

    // Split text into chunks
    const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, "g"));

    // Initialize the model
    const tts = await KokoroTTS.from_pretrained(model_id, {
      dtype: "q8", // Option: "fp32", "fp16", "q8", "q4", "q4f16"
    });

    const audioPaths = [];

    // Generate audio for each chunk
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Generating audio for chunk ${i + 1}/${chunks.length}`);
      const audio = await tts.generate(chunks[i], { voice });

      const chunkPath = path.resolve(`./chunk_${i + 1}.wav`);
      await audio.save(chunkPath);
      audioPaths.push(chunkPath);
    }

    // Merge audio chunks
    const outputPath = "./final_audio.wav";
    const mergeCommand = `sox ${audioPaths.join(" ")} ${outputPath}`;
    execSync(mergeCommand);

    // Clean up temporary chunk files
    audioPaths.forEach(file => fs.unlinkSync(file));

    console.log("Final audio saved successfully to", outputPath);
    return outputPath;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
}

// Example usage
const text = 'Anatomy is the scientific discipline that investigates the structure of the body. The term "anatomy" literally means "study of the structure" or "the study of the body". In medical contexts, anatomy refers to the study of how different parts of the body work together to maintain life. It encompasses various aspects of the body, including its structure, function, and how it develops throughout one\'s lifetime. Anatomy helps us understand the physical properties of our bodies and how they interact with each other and with the environment around us.';
generateSpeechChunked(text)
  .then(audioPath => {
    console.log(`Generated speech saved to ${audioPath}`);
  })
  .catch(error => {
    console.error("Failed to generate speech:", error);
  });
