const prisma = require("../models/prismaClient");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../data/pdfs"); // Path to the 'data/pdfs' folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const newFileName = uuidv4() + fileExtension; // Generate a unique file name using uuid
    cb(null, newFileName); // Save file with the new unique name
  },
});

const upload = multer({ storage });

const uploadPdf = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const indexName = path.parse(file.filename).name;
    const filePath = `../data/pdfs/${indexName}.pdf`;

    const pdfRecord = await prisma.pdf.create({
      data: {
        userId,
        fileName: file.originalname,
        filePath: filePath,
        size: file.size,
        indexName: indexName,
      },
    });

    res.status(200).json({
      message: "PDF uploaded successfully",
      pdfRecord,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while uploading the PDF" });
  }
};

const getPdf = async (req, res) => {
  try {
    const { userId, indexName } = req.params;

    const pdfRecord = await prisma.pdf.findUnique({
      where: { userId_indexName: { userId, indexName } },
    });

    if (!pdfRecord) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const filePath = path.join(__dirname, pdfRecord.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the PDF" });
  }
};

const formatFileSize = (size) => {
    if (!size) return 'Unknown size';
    if (size < 1024) return `${size} Bytes`;
    if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / 1048576).toFixed(2)} MB`;
  };

const getUserPdfs = async (req, res) => {
  const { userId } = req.params;

  try {
    const pdfRecords = await prisma.pdf.findMany({
      where: {
        userId,
      },
      select: {
        fileName: true,
        size: true,
        uploadedAt: true,
        indexName: true,
      },
    });

    const pdfFiles = pdfRecords.map((pdf) => ({
      name: pdf.fileName,
      size: formatFileSize(pdf.size),
      uploadedAt: pdf.uploadedAt.toISOString(),
      indexName: pdf.indexName,
    }));

    res.status(200).json(pdfFiles);
  } catch (error) {
    console.error("Error retrieving PDFs:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user PDFs." });
  }
};

module.exports = { upload, uploadPdf, getPdf, getUserPdfs };
