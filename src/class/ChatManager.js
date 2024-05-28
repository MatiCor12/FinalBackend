import messageModel from "../models/messages.model.js";

class MessageManager {

    constructor() {
    }

    async getChats() {
        try {
            const messages = await messageModel.find().lean()
            return messages
        } catch (error) {
            console.log(error);
        }
    }

    async addMessage(data) {
        try {
            let { user, message } = data
            console.log(user, message);
            if (!user || !message) {
                console.log({ status: "Error", error: "Parameters are missing" });
            }
            let result = await messageModel.create({ user, message })
            return result
        } catch (error) {
            console.log('Error when creating message', error);
        }
    }
}

export default MessageManager