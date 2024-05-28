import { Schema, model } from "mongoose";

//Nombre de la nueva coleccion

const nameCollection = 'Producto'

const ProductoSchema = new Schema ({
    title: { type: String, required: [true, 'The product title is required']},
    description: { type: String, required: [true, 'Product description is mandatory']},
    code: { type: String, required: [true, 'The product code is mandatory']},
    price: { type: Number, required: [true, 'The price of the product is mandatory']},
    status: { type: Boolean, default: true},
    stock: { type: Number, required: [true, 'Product stock is mandatory']},
    category: { type: String, required: [true, 'The product category is mandatoryo']},
    thumbnails: [{type: String}],
})

ProductoSchema.set('toJSON',{
    transform: function(doc,ret){
        delete ret.__v;
        return ret;
    }
})
export const productModel = model(nameCollection, ProductoSchema)