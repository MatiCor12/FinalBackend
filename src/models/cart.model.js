import { Schema, SchemaType, model } from "mongoose";

//Nombre de la nueva coleccion

const nameCollection = 'Cart'

const CartSchema = new Schema ({
    products: [{
        _id:false,
        id:{
            type:Schema.Types.ObjectId,
            ref: 'Producto'
        },
        quantity:{
            type:Number,
            required:[true, 'The quantity of the product is mandatory']
        }
    }
    ]
})

CartSchema.set('toJSON',{
    transform: function(doc, ret){
        delete ret.__v;
        return ret;
    }
})

export const cartModel = model(nameCollection, CartSchema)