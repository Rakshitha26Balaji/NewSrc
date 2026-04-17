// ✅ BEST & INDUSTRY-STANDARD (Recommended)
// Way-1: Create LEAD first (Draft / Pending), then upload documents

// Backend flow

// 2. POST /leads/{leadId}/documents
//    → upload files
//    → save metadata with leadId

// 1. POST /leads
//    → create lead with status = DRAFT
//    → return leadId

// 3. PUT /leads/{leadId}
//    → submit / finalize lead
//    → status = SUBMITTED
import db from "../models/index.js";
const OrderReceivedDocumentModel = db.OrderReceivedDocumentModel;
import path from "path";
import fs from "fs";

export const uploadDocument = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { documentType, uploadedBy } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "File is missing (check field name 'file')"
      });
    }

    const doc = await OrderReceivedDocumentModel.create({
      documentType,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      uploadedBy,
    });

    res.status(201).json(doc);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      error: err.message
    });
  }
};

export const replaceDocumentFile = async (req, res) => {
  try {
    const { documentId } = req.params;
    const file = req.file;
    console.log(documentId, file);

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const doc = await OrderReceivedDocumentModel.findByPk(documentId);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // ✅ delete old file from disk (if exists)
    if (doc.filePath && fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    // ✅ update db record
    await doc.update({
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    res.status(200).json({
      message: "Document replaced successfully",
      doc,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    console.log("req.body from updateDocument controller : ", req.body);
    // const { leadId } = req.params;
    const { leadId, documentId } = req.body;

    const doc = await OrderReceivedDocumentModel.findByPk(documentId);
    console.log("doc", doc);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const updatedDoc = await doc.update({
      leadId,
      // documentType,
      // originalFileName: file.originalName,
      // storedFileName: file.fileName,
      // filePath: file.path,
      // fileSize: file.size,
      // mime_type: file.mimetype,
      // uploadedBy
    });

    res.status(201).json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDocumentsByLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const docs = await OrderReceivedDocumentModel.findAll({
      where: { leadId },
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const __dirname = path.resolve();
    let UPLOADS_DIR = path.join(__dirname, "uploads/orderReceivedDocument/");
    const { documentId } = req.params;

    const doc = await OrderReceivedDocumentModel.findByPk(documentId);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    console.log(" UPLOADS_DIR : ", UPLOADS_DIR);
    console.log(" doc : ", doc.storedFileName);
    res.download(UPLOADS_DIR + doc.storedFileName, doc.originalFileName);
    // res.setHeader("Content-Disposition",`attachment; filename="${doc.originalFileName}"`);
    // res.setHeader("Content-Type", "application/pdf");
    // res.sendFile(UPLOADS_DIR + doc.storedFileName);
  } catch (err) {
    res.status(500).json({ 
      error: err.message 
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const doc = await OrderReceivedDocumentModel.findByPk(documentId);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    fs.unlinkSync(doc.filePath);
    await doc.destroy();

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
