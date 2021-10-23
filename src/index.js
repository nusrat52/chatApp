const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const app = express();
const server = http.createServer(app);
const publicFolder = path.join(__dirname, "../public");
const {
  getUsersInRoom,
  getUser,
  removeUser,
  addUser,
} = require("./utils/user");
const io = socket(server);

app.use(express.json());
app.use(express.static(publicFolder));

app.get("/", (req, res) => {
  res.render("index");
});

let count = 0;






io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, cb) => {
    const { user, error } = addUser({ username, room, id: socket.id });

    if (error) {
      return cb(error);
    }

    socket.join(user.room);
    socket.broadcast
      .to(user.room)
      .emit("newOne", { message: user.username + " joined", date: Date.now() });

    io.to(user.room).emit("sidebar", {
      room: user.room,
      sbData: getUsersInRoom(user.room),
    });
  });

  socket.on("submit", (value, cb) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", {
      message: value,
      date: Date.now(),
      name: user.username,
    });

    cb();
  });

  socket.on("posi", ({ lat, long }, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("Locationmessage", {
      message: `https://google.com/maps?q=${lat},${long}`,
      date: Date.now(),
      name: user.username,
    });

    callback("just mesaj");
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        message: user.username + " was left",
        date: Date.now(),
      });
    }
    io.to(user.room).emit("sidebar")
  });

});

server.listen(process.env.PORT, () => {
  console.log("express ishe dushdu");
});
