$(document).ready(() => {
  let socket = io();
  let mainWrap = $("#mainWrap");
  let chatForm = $("#chatForm");
  let message = $("#chatInput");
  let chatWindow = $("#chatWindow");
  let userForm = $("#userForm");
  let userFormWrap = $("#userFormWrap");
  let username = $("#username");
  let users = $("#users");
  let error = $("#error");

  //  Submit user form
  userForm.on("submit", e => {
    //  Empty username?
    if (username.val().trim().length <= 0) {
      error.html("Please enter a username");
    } else {
      socket.emit("set user", username.val().trim(), data => {
        if (data) {
          userFormWrap.hide();
          error.hide();
          mainWrap.show();
        } else {
          error.html("Username is taken");
        }
      });
    }
    e.preventDefault();
  });

  //  Submit message form
  chatForm.on("submit", e => {
    //  Empty message?
    if (message.val().trim().length <= 0) {
      error.show();
      error.html("Please enter a message");
    } else {
      error.hide();
      socket.emit("send message", message.val().trim());
      //  Reset message input
      message.val("");
    }
    e.preventDefault();
  });

  //  Display chat window
  socket.on("show message", data => {
    chatWindow.append(`<strong>${data.user}</strong>${data.msg}<br>`);
    chatWindow.stop().animate({ scrollTop: chatWindow[0].scrollHeight }, 1000);
  });

  //  Display users
  socket.on("users", data => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
      html += `<li class="list-group-item"> ${data[i]}</li>`;
      users.html(html);
    }
    users.stop().animate({ scrollTop: users[0].scrollHeight }, 1000);
  });
});
