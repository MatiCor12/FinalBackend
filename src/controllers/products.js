import { request, response} from 'express'
import { addProductService, deleteProductService, getProductByIdService, getProductsService, updateProductService } from '../services/products.js';

export const getProducts = async (req = request, res = response) => {
    try {
        const result = await getProductsService({...req.query})
        return res.json({ result })
    } catch (error) {
        return res.status(500).json({msg:'Talk to administrator'})
    }
}

export const getProductById = async (req = request, res = response) => {
    try {
        const {pid} = req.params;
        const product = await getProductByIdService(pid)
        if(!product)
            return res.status(404).json({ msg: `The product with id${pid} not found`})
        return res.json({ product })
    } catch (error) {
        console.log('getProductById -> ', error)
        return res.status(500).json({msg:'Talk to administrator'})
    }
}

export const addProduct = async (req = request, res = response) => {
    try {
        const { title, description, price, code, stock, category} = req.body;
        if(!title, !description, !price, !code, !stock, !category)
            return res.status(404).json({ msg: 'Fields [title,description,price,code,stock,category] they are mandatory'})
        const product = await addProductService({...req,body})
        return res.json({ product })
    } catch (error) {
        return res.status(500).json({msg:'Talk to administrator'})
    }
}

export const deleteProduct = async (req = request, res = response) => {
    try {
        const {pid} = req.params
        const product = await deleteProductService(pid)
        if(product)
            return res.json({msg:'Removed product', product})
        return res.status(404),json({msg:`Could not delete product with id ${pid}`})
    } catch (error) {
        console.log('deleteProduct ->', error)
        return res.status(500).json({msg:'Talk to administrator'})
    }
}

export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params
        const {_id, ...rest} = req.body
        const product = await updateProductService(pid, rest)
        if(product)
            return res.json({msg:'Updated product', product})
        return res.status(404),json({msg:`Could not update product with id ${id}`})
    } catch (error) {
        return res.status(500).json({msg:'Talk to administrator'})
    }
}