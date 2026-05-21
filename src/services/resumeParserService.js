import * as pdfjsLib
from "pdfjs-dist/legacy/build/pdf.mjs";




// Parse Resume PDF
export const parseResume =
  async (pdfBuffer) => {

    // Convert Buffer → Uint8Array
    const uint8Array =
      new Uint8Array(
        pdfBuffer
      );


    // Load PDF
    const pdf =
      await pdfjsLib
        .getDocument({
          data: uint8Array
        })
        .promise;


    let extractedText = "";


    // Read All Pages
    for (
      let pageNum = 1;
      pageNum <= pdf.numPages;
      pageNum++
    ) {

      const page =
        await pdf.getPage(
          pageNum
        );

      const content =
        await page.getTextContent();


      const text =
        content.items
          .map(
            item => item.str
          )
          .join(" ");


      extractedText +=
        text + "\n";
    }


    return extractedText;
  };