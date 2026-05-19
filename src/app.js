import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/index.js";

import notFoundMiddleware
from "./middleware/notFoundMiddleware.js";

import errorMiddleware
from "./middleware/errorMiddleware.js";


const app = express();


// Security
app.use(helmet());


// Compression
app.use(compression());


// Logging
app.use(morgan("dev"));


// CORS
app.use(cors());


// Body Parser
app.use(express.json());

app.use(
  express.urlencoded({ extended: true })
);


// Health Check
app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message:
      "InternPath API Running Successfully"
  });
});


// API Routes
app.use("/api", routes);


// Not Found Middleware
app.use(notFoundMiddleware);


// Error Middleware
app.use(errorMiddleware);


export default app;