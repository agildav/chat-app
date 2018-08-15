const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io").listen(http);

const port = process.env.PORT || 3000;
let users = [];

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Static path
app.use(express.static(path.join(__dirname, "public")));

//  Home page
app.get("/", (req, res, next) => {
  res.render("index");
});

//  Socket.io connection
io.on("connection", function(socket) {
  updateUsers();
  //  Set username
  socket.on("set user", (data, callback) => {
    //  Users exists?
    if (users.indexOf(data) != -1) {
      callback(false);
    } else {
      //  User does not exist
      callback(true);
      //  Push user to array
      socket.username = data;
      users.push(socket.username);
      //  Update users in client side
      updateUsers();
    }
  });

  //  Messages from users
  socket.on("send message", data => {
    io.emit("show message", { msg: data, user: socket.username });
  });

  //  Disconnect user
  socket.on("disconnect", () => {
    if (!socket.username) {
      return;
    }
    //  Remove the user from the array
    users.splice(users.indexOf(socket.username), 1);
    //  Update users in client side
    updateUsers();
  });
});

//  Send users array to client
const updateUsers = () => {
  io.emit("users", users);
};

//  Init server
http.listen(port, () => {
  console.log("Server started on port " + port);
});
