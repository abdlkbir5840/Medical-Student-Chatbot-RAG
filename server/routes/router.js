const express = require('express');
const roleRouter = require('./role.router');
const authRouter = require('./auth.router');
const pdfRouter = require('./pdf.router');
const llmRouter = require('./llm.router');
const textToSpeechRouter = require('./text-to-speech.router');
const router = express.Router();

router.use('/role', roleRouter);
router.use('/auth', authRouter);
router.use('/files', pdfRouter);
router.use('/llm', llmRouter);
router.use('/speech', textToSpeechRouter);
module.exports = router;