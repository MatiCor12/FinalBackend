import MessageManager from "../dao/messageMongo.js";
const mm = new MessageManager();

export const socketChat = (socketServer) => {
    socketServer.on('connection', async (socket) => {
        console.log("Logged in user with id: " + socket.id);

        socket.on("nuevousuario", async (usuario) => {
            socket.broadcast.emit("broadcast", usuario);

            try {
                const messages = await mm.getMessages();
                socket.emit("chat", messages);
            } catch (error) {
                console.error("Error getting messages", error);
            }
        });

        socket.on("mensaje", async (info) => {
            await mm.createMessage(info);
            const messages = await mm.getMessages();
            socketServer.emit("chat", messages);
        });

        socket.on("clearchat", async () => {
            try {
                await mm.deleteAllMessages();
                const messages = await mm.getMessages();
                socketServer.emit("chat", messages);
            } catch (error) {
                console.error("Error when deleting messages", error);
            }
        });
    });
};