const loading = document.getElementById("loading");
const chatForm = document.getElementById("chat-form");
const chatMain = document.getElementById("chat");
const chatBox = document.getElementById("msg");
const chatContainer = document.getElementById("chat-container");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const notification = document.getElementById("notification");

const messages = document.getElementById("message-container");

// Get username and room from URL
const { user_name, chatroom_id, nonce } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

const newMessageColor = "#ffae00";
const noMessageColor = "#8a8a8a";
//Nonce validation EndPoints
const CLAIMS_TOKEN_URL =
  "https://appstoretst.bidmc.org/authService/100000002/login";
const VALIDATE_TOKEN_URL =
  "https://appstoretst.bidmc.org:443/services/NonceWS/ValidateToken";

//App Creds
const APP_KEY = "5a87d6ef975b9cb4f0209c091b8c2308";
const APP_SECRET = "3f056d9b0d87a6d00c44401bb25d6a5";
const SERVICE_TOKEN = "c7f3e30a-87b3-40c7-bfce-5577ab2d7f4b";
const PARAM_LIST = "username=chimevideo";

//get token
const token = getClaimsToken();

// Join chatroom
socket.emit("joinRoom", { user_name, chatroom_id });

chatMain.addEventListener("focus", (e) => {
  changeNotificationIconColor(noMessageColor);
});

chatBox.addEventListener("click", (e) => {
  changeNotificationIconColor(noMessageColor);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);
  changeNotificationIconColor(newMessageColor);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;
  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  // e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.name} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function toggleChat() {
  if (chatMain.style.display === "none" || chatMain.style.display === "") {
    chatMain.style.display = "block";
  } else {
    chatMain.style.display = "none";
  }
}

function changeNotificationIconColor(notificationColor) {
  let notificationIcon = document.getElementById("notification-icon");
  notificationIcon.style.color = notificationColor;
}

async function getClaimsToken() {
  await fetch(CLAIMS_TOKEN_URL, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
      "X-Kony-App-Key": APP_KEY,
      "X-Kony-App-Secret": APP_SECRET,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      validateToken(data.claims_token.value);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function validateToken(claimsToken) {
  let data = {
    token: nonce,
    serviceToken: SERVICE_TOKEN,
    paramList: PARAM_LIST,
  };

  fetch(VALIDATE_TOKEN_URL, {
    method: "POST", // or 'PUT'
    headers: {
      "X-Kony-Authorization": claimsToken,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      loading.style.display = "none";
      if (data.status == "invalid") {
        if (doesCookieExist("nonce") == "") {
          chatContainer.style.display = "none";
          messages.style.display = "block";
          messages.innerText = "Invalid Nonce Token";
        } else {
          chatContainer.style.display = "block";
        }
      } else {
        chatContainer.style.display = "block";
        createCookie(nonce);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function createCookie(nonceToken) {
  document.cookie = "nonce =" + nonceToken;
}

function doesCookieExist(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
