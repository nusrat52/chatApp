const socket = io();
const form = document.querySelector("form");
const formInput = form.querySelector("input");
const formButton = form.querySelector("button");
const messageContainer = document.querySelector("#messages");
const mesageView = document.querySelector("#view").innerHTML;
const mesageViewOfLoc = document.querySelector("#viewOfLoc").innerHTML;
const sidebarView = document.querySelector("#sidebar-template");
const qString = Qs.parse(location.search, { ignoreQueryPrefix: true });
const autoScroll = () => {
  const newMes = messageContainer.lastElementChild
  const mesStyle=getComputedStyle(newMes)
  const mesMargin = parseInt(mesStyle.marginBottom)
  const newMesHeight = newMes.offsetHeight + mesMargin
  
  const visibleHeight = messageContainer.offsetHeight
  
  const containerHeight = messageContainer.scrollHeight
  
  const scrollOffset = messageContainer.scrollTop + visibleHeight
  
  if (containerHeight - newMesHeight <= scrollOffset) {
    messageContainer.scrollTop=messageContainer.scrollHeight
  }

};
socket.on("message", (mes) => {
  const html = Mustache.render(mesageView, {
    message: mes.message,
    date: moment(mes.date).format("h:mm a"),
    name: mes.name,
  });

  messageContainer.insertAdjacentHTML("beforeend", html);

  autoScroll();
});

socket.on("newOne", (mes) => {
  const html = Mustache.render(mesageView, {
    message: mes.message,
    date: moment(mes.date).format("h:mm a"),
  });

  messageContainer.insertAdjacentHTML("beforeend", html);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = formInput.value;

  formButton.setAttribute("disabled", "disabled");

  socket.emit("submit", value, (mesage) => {
    formInput.value = "";
    formInput.focus();
    formButton.removeAttribute("disabled");
  });
});

socket.on("Locationmessage", ({ message, date, name }) => {
  const html = Mustache.render(mesageViewOfLoc, {
    message,
    date: moment(date).format("h:mm a"),
    name,
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

const shareButton = document.querySelector(".share");

const share = (e) => {
  shareButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((p) => {
    socket.emit(
      "posi",
      { lat: p.coords.latitude, long: p.coords.longitude },
      (message) => {
        console.log(message);
        shareButton.removeAttribute("disabled");
      }
    );
  });
};

socket.emit("join", qString, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("sidebar", ({ room, sbData }) => {
  const html = Mustache.render(sidebarView.innerHTML, {
    room,
    sbData,
  });
  document.querySelector(".chat__sidebar").innerHTML = html;
});
