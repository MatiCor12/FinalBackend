import ProductManager from "../dao/controllers/productManager.js"
import { __dirname } from "../utils.js"
const pm = new ProductManager(__dirname+'/data/products.json')

const socketProducts = (socketServer) => {
    socketServer.on("connection",async(socket)=>{
        console.log("client connected con ID:",socket.id)
        const listadeproductos=await pm.getProductsView()

        socketServer.emit("eshippingofproducts",listadeproductos)
        socket.on("addProduct",async(obj)=>{
            await pm.addProduct(obj)
            const listadeproductos=await pm.getProductsView()
            socketServer.emit("shippingofproducts",listadeproductos)
            })
        socket.on("deleteProduct",async(id)=>{
            await pm.deleteProduct(id)
            const listadeproductos=await pm.getProductsView()
            socketServer.emit("shippingofproductss",listadeproductos)
            })
    })
}

export default socketProducts;