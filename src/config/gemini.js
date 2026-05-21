import {
  GoogleGenerativeAI
} from "@google/generative-ai";




// Gemini Client
const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );




// Gemini Model
const model =
  genAI.getGenerativeModel({

    model: "gemini-2.5-flash"
  });


export default model;