import mongoose from 'mongoose';

//Nombre de la nueva coleccion

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: Number
    }]
});

const Cart = mongoose.model('Carts', cartSchema);

export default Cart;