import mongoose from "mongoose";

//Nombre de la nueva coleccion

const messageCollection = "Messages"

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
})

messagesSchema.set('toJSON',{
    transform: function(doc,ret){
        delete ret.__v;
        return ret;
    }
})

const messageModel = mongoose.model(messageCollection, messagesSchema)

export default messageModel
