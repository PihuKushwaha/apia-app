import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractText(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    return extractPdf(file);
  }

  if (name.endsWith(".docx")) {
    return extractDocx(file);
  }

  if (
    file.type.startsWith("image/") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png")
  ) {
    return extractImage(file);
  }

  throw new Error("Unsupported file type.");
}

async function extractDocx(file) {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({
    arrayBuffer: buffer,
  });
  return result.value;
}

async function extractPdf(file) {
  const buffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: buffer,
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text +=
      content.items
        .map((item) => item.str)
        .join(" ") + "\n";
  }

  return text;
}

async function extractImage(file) {
  const {
    data: { text },
  } = await Tesseract.recognize(file, "eng+hin");

  return text;
}