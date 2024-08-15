import mongoose from 'mongoose';

//Nombre de la nueva coleccion

const collectionName = "messages";

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
}, { timestamps: true });

const messageModel = mongoose.model(collectionName, messageSchema);

export default messageModel;