const express = require("express");
const { generateSpeech } = require("../controllers/text-to-speech.controller.js");

const textToSpeechRouter = express.Router();

textToSpeechRouter.post("/generate-speech", generateSpeech);

module.exports = textToSpeechRouter;
