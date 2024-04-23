import {promises as fs} from 'fs'
import {nanoid} from 'nanoid'

class ProductManager {
    constructor() {
        this.path = "./src/data/products.json"
    }

    readProducts = async() =>{
        let products = await fs.readFile(this.path, 'utf8')
        return JSON.parse(products)
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    exist = async (id) => {
        let products = await this.readProducts()
        return products.find(prod => prod.id === id)
    }

    addProducts = async (product) => {
        let productsOld = await this.readProducts()
        product.id = nanoid()
        let productAll = [...productsOld, product]
        await this.writeProducts(productAll)
        return "Products added"
    }

    getProducts = async() =>{
        return await this.readProducts()
    }

    getProductsById = async (id) =>{
        let productById = await this.exist(id)
        if(!productById) return "Product not found"
        return productById
    }

    updateProducts = async (id, product) => {
        let productById = await this.exist(id)
        if(!productById) return "Product not found"
        await this.deleteProducts(id)
        let productOld = await this.readProducts()
        let products = [{...product, id : id}, ...productOld]
        await this.writeProducts(products)
        return "Updated product"
    }

    deleteProducts = async (id) => {
        let products = await this.readProducts()
        let existProducts = products.some(prod => prod.id === id)
        if(existProducts){
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Product delete"
        }
        return "The product to be removed does not exist"
    }
}

export default ProductManager