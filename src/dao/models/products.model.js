import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

//Nombre de la nueva coleccion

const productCollection = "products"
const productSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'The product title is required']},
    description: {type: String, required:  [true, 'Product description is mandatory']},
    code: {type: String, unique: true, required: [true, 'The product code is mandatory']},
    price: {type: Number, required:  [true, 'The price of the product is mandatory']},
    status: {type: Boolean, default: true},
    stock: {type: Number, required: [true, 'Product stock is mandatory']},
    thumbnail: {type: String, required: false },
    category: {type: String, required: [true, 'The product category is mandatoryo']},
    owner: { type: String, default: 'admin' }
})

productSchema.plugin(mongoosePaginate)
const productsModel = mongoose.model(productCollection,productSchema)

export default productsModel