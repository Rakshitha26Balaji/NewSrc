import db from "../models/index.js";
const MarketingOrderReceivedDomExp = db.MarketingOrderReceivedDomExp;
import multer from "multer";
import path from "path";


// 🔹 UPDATE ORDER RECEIVED (EDIT)
export const UpdateOrderReceivedData = async (req, res) => {
  try {
    const { purchaseOrder } = req.params;

    const [updated] = await MarketingOrderReceivedDomExp.update(
      req.body,
      { where: { purchaseOrder } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

// 🔹 DELETE ORDER RECEIVED
export const DeleteOrderReceivedData = async (req, res) => {
  try {
    const { purchaseOrder } = req.params;

    const deleted = await MarketingOrderReceivedDomExp.destroy({
      where: { purchaseOrder },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};


export const CreateMarketingOrderReceivedDomExpBulk = async (req, res) => {
  try {
    const BulkData = req.body.excelData;
    console.log("CreateMarketingOrderReceivedDomExpBulk service Bulk called", BulkData);

    const insertedRecords = await MarketingOrderReceivedDomExp.bulkCreate(BulkData, {
      validate: true,
    });

    res.status(200).json({
      success: true,
      data: insertedRecords,
      message: "All records inserted successfully",
      error: {}
    });
  } catch (error) {
    console.error("Error has encountered...");
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation error
      console.error(
        "Error CreateMarketingOrderReceivedDomExpBulk: Duplicate key value violates unique constraint"
      );
      // Return appropriate error response to client
      res.status(400).json({
        success: false,
        data: [],
        message: "Duplicate key value violates unique constraint",
        error: error,
      });
    } else {
      // Handle other errors
      console.error("Error CreateMarketingOrderReceivedDomExpBulk :", error);
      // Return appropriate error response to client
      res.status(500).json({
        success: false,
        data: [],
        message: "An error occurred",
        error: error,
      });
    }
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname)
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // set file size limit to 1000 MB
});

// Right it acc

export const GetOrderReceivedData = (request, response) => {
  MarketingOrderReceivedDomExp.findAll({
    raw: true,
  })
    .then((data) => {
      // console.log("MarketingOrderReceivedDomExp Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ data: "No data found for GetOrderReceivedData" });
    });
};

export const CreateGetOrderReceivedData = (req, res) => {
  //console.log(" MarketingOrderReceivedDomExp service called for req", req);

  // console.log(
  //   " MarketingOrderReceivedDomExp service called for req body",
  //   req.body
  // );

  const __dirname = path.resolve();
  let UPLOADS_DIR = path.join(__dirname, "Mar_uploads");
  console.log("UPLOADS_DIR", UPLOADS_DIR);


  const OrderReceivedReqData = {
    contractName: req.body.contractName,
    customerName: req.body.customerName,
    customerAddress: req.body.customerAddress,
    orderReceicedDate: req.body.orderReceivedDate,
    purchaseOrder: req.body.purchaseOrder,
    typeOfTender: req.body.typeOfTender,

    valueWithoutGST: req.body.valueWithoutGST,
    valueWithGST: req.body.valueWithGST,
    JSON_competitors: req.body.JSON_competitors,
    remarks: req.body.remarks,
    contractCopy: req.body.attachment,
    submittedAt: req.body.submittedAt,
    // new fields
    OperatorId: req.body.OperatorId,
    OperatorName: req.body.OperatorName,
    OperatorRole: req.body.OperatorRole,
    OperatorSBU: req.body.OperatorSBU,
    FileName: req.body.fileName,
    FilePath: req.body.filePath,
    HardDiskFileName: req.body.hardDiskFileName,
    Dom_or_Export:req.body.Dom_or_Export,
  };

  MarketingOrderReceivedDomExp.create(OrderReceivedReqData)
    .then((data) => {
      // res.send(data);
      console.log("Success");
      res.send(data);
    })
    .catch((err) => {
      console.log("Error while saving", err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Create OrderReceived Data.",
      });
    });

  console.log(" create into Harddisk");
};

export const UploadPdfFile = (req, res) => {
  const __dirname = path.resolve();
  const UPLOADS_DIR = path.join(__dirname, "uploads");

  upload.array("files", 10)(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = req.files.map((file) => ({
      originalName: file.originalname,
      savedName: file.filename,
      filePath: UPLOADS_DIR,
      size: file.size,
    }));

    res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  });
};

