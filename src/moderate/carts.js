import { cartModel } from "../models/cart.model.js"

export const getCartByIdModerate = async (cid) => {
    try{
        return  await cartModel.findById(cid).populate('products.id').lean()
    } catch (error) {
        console.log('getCartByIdModerate ->', error)
        throw error
    }
}

export const createCartModerate = async () => {
    try{
        return await cartModel.create({})
    } catch (error) {
        console.log('createCartModerate ->', error)
        throw error
    }
}

export const addProductInCartModerate = async (cid, pid) => {
    try{

        const carrito = await cartModel.findById(cid)

        if(!carrito)
            return null

        const productoInCart = carrito.products.find(p => p.id.toString() === pid)

        if(productoInCart)
            productoInCart.quantity++
        else
        carrito.products.push({id:pid, quantity: 1})

        carrito.save()

        return carrito
    } catch (error) {
        console.log('addProductInCartModerate->', error)
        throw error
    }
}

export const deleteProductsInCartModerate = async (cid, pid) => {
    try{
        return await cartModel.findByIdAndUpdate(cid, {$pull:{'products':{id:pid}}}, {new:true})
    }catch (error) {
        console.log('deleteProductsInCartModerate->', error)
        throw error
    }
}

export const updateProductsInCartModerate = async (cid, pid, quantity) => {
    try{
        return await cartModel.findOneAndUpdate(
            { _id:cid, 'products.id':pid },
            { $set: {'products.$.quantity': quantity} },
            { new:true }
        )
    }catch (error) {
        console.log('updateProductsInCartModerate->', error)
        throw error
    }
}

export const deleteCartModerate = async (cid) => {
    try{
        return await cartModel.findByIdAndUpdate(cid, {$set:{'products':[] }}, {new:true})
    }catch (error) {
        console.log('deleteCartModerate->', error)
        throw error
    }
}