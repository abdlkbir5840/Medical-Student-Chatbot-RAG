const express = require('express');
const { upload, uploadPdf, getPdf, getUserPdfs } = require('../controllers/pdf.controller');
const pdfRouter = express.Router();

pdfRouter.post('/upload-pdf', upload.single('pdf'), uploadPdf);
pdfRouter.get('/pdf/:userId/:indexName', getPdf);
pdfRouter.get('/pdfs/:userId', getUserPdfs);


module.exports = pdfRouter;
