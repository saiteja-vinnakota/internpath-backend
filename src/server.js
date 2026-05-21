import "./config/env.js";

import http from "http";

import { Server } from "socket.io";

import app from "./app.js";

import connectDB from "./config/db.js";

import {
  initializeSocket
} from "./sockets/notificationSocket.js";


const PORT =
  process.env.PORT || 5000;


// Database Connection
connectDB();


// Create HTTP Server
const server =
  http.createServer(app);


// Socket Server
const io =
  new Server(server, {

    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


// Initialize Socket
initializeSocket(io);


// Start Server
server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});