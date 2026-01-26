const PDFParser = require("pdf2json");
const mammoth = require("mammoth");

async function extractText(file) {
  if (!file || !file.buffer) {
    throw new Error("Invalid file upload: No buffer found.");
  }

  if (file.mimetype === "application/pdf") {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);

      pdfParser.on("pdfParser_dataError", (errData) => 
        reject(new Error(errData.parserError))
      );
      
      pdfParser.on("pdfParser_dataReady", () => {
        const text = pdfParser.getRawTextContent() || "";
        resolve(cleanText(text));
      });

      pdfParser.parseBuffer(file.buffer);
    });
  }

  if (
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const data = await mammoth.extractRawText({ buffer: file.buffer });
    return cleanText(data.value);
  }

  if (file.mimetype === "text/plain") {
    return cleanText(file.buffer.toString("utf-8"));
  }

  throw new Error("Unsupported file type: " + file.mimetype);
}

function cleanText(text) {
  if (!text) return "";

  let decodedText = text;
  
  try {
    decodedText = decodeURIComponent(text);
  } catch (e) {
    decodedText = text
      .replace(/%20/g, " ")
      .replace(/%3A/g, ":")
      .replace(/%2F/g, "/")
      .replace(/%2C/g, ",");
  }

  return decodedText
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

module.exports = { extractText };
