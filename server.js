const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io").listen(http);

const port = process.env.PORT || 3000;

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
  console.log("a user connected");
});

//  Init server
http.listen(port, () => {
  console.log("Server started on port " + port);
});
