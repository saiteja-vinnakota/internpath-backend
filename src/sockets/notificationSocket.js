let ioInstance = null;


// Initialize Socket Server
export const initializeSocket = (io) => {

  ioInstance = io;


  io.on("connection", (socket) => {

    console.log(
      `Socket Connected: ${socket.id}`
    );


    // Join Personal Room
    socket.on(
      "join",
      (userId) => {

        socket.join(userId);

        console.log(
          `User Joined Room: ${userId}`
        );
      }
    );


    // Disconnect
    socket.on(
      "disconnect",
      () => {

        console.log(
          `Socket Disconnected: ${socket.id}`
        );
      }
    );
  });
};


// Get IO Instance
export const getIO = () => {

  if (!ioInstance) {

    throw new Error(
      "Socket.io not initialized"
    );
  }

  return ioInstance;
};

