const socketClient = io();
const nombreUsuario = document.getElementById("nombreusuario");
const formulario = document.getElementById("formulario");
const inputmensaje = document.getElementById("mensaje");
const chatMessages = document.getElementById("chat-messages");
const clearChatButton = document.getElementById("clear-chat");

let usuario = null;

if (!usuario) {
    Swal.fire({
        title: "Welcome to the Chat",
        text: "Enter your user",
        input: "text",
        inputValidator: (value) => {
            if (!value) {
                return "You need to enter your Name";
            }
        }
    }).then((username) => {
        usuario = username.value;
        nombreUsuario.innerHTML = usuario;
        socketClient.emit("nuevousuario", usuario);
    }).catch((error) => {
        console.error("Error when entering user", error);
    });
}

formulario.onsubmit = (e) => {
    e.preventDefault();
    if (inputmensaje.value.trim() === "") return;

    const info = {
        user: usuario,
        message: inputmensaje.value
    };

    socketClient.emit("mensaje", info);
    inputmensaje.value = "";
};

clearChatButton.onclick = () => {
    socketClient.emit("clearchat");
};

socketClient.on("chat", (mensajes) => {
    const chatRender = mensajes.map(e => {
        return `<div class="message"><strong>${e.user}:</strong> ${e.message}</div>`;
    }).join("");
    chatMessages.innerHTML = chatRender;
});

socketClient.on("broadcast", (usuario) => {
    Toastify({
        text: `Income ${usuario} to chat`,
        duration: 3000,
        position: 'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
});