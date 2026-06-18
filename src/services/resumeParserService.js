import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const parseResume = async (pdfBuffer) => {
  const uint8Array = new Uint8Array(
    pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    )
  );

  const pdf = await pdfjsLib
    .getDocument({ data: uint8Array })
    .promise;

  let extractedText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    extractedText += text + "\n";
  }

  return extractedText;
};