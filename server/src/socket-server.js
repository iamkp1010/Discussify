const jwt = require("jsonwebtoken");
let users = [];

const authSocket = (socket, next) => {  
  let cookieStr = socket.handshake.headers?.cookie
  let token;
  if(cookieStr?.length > 12 && cookieStr.substring(0, 11) == 'accessToken') token = cookieStr.substr(12);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.decoded = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  } else {
    next(new Error("Authentication error"));
  }
};

const socketServer = (socket) => {
  const userId = socket.decoded._id;
  users.push({ userId, socketId: socket.id });

  socket.on("send-message", (recipientUserId, username, content) => {
    const recipient = users.find((user) => user.userId == recipientUserId);
    if (recipient) {
      socket
        .to(recipient.socketId)
        .emit("receive-message", userId, username, content);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.userId != userId);
  });
};

module.exports = { socketServer, authSocket };