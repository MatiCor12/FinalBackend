import ProductManager from "../dao/productsMongo.js";
const pm = new ProductManager()

export const socketProducts = (socketServer) => {
    socketServer.on("connection",async(socket)=>{
        console.log("client connected con ID:",socket.id)
        const listadeproductos=await pm.getProductsView()
        socketServer.emit("enviodeproducts",listadeproductos)
        socket.on("addProduct", async (obj) => {
            const { user, product } = obj;
            if (user && product) {
                await pm.addProduct(product, user);
                const listadeproductos = await pm.getProductsView();
                socketServer.emit("enviodeproducts", listadeproductos);
            } else {
                console.error("User or product data is missing");
            }
        });
        socket.on("deleteProduct", async (data) => {
            const { user, id } = data;

            const product = await pm.getProductById(id);
            if (product) {
                if (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email)) {
                    await pm.deleteProduct(id);
                    const listadeproductos = await pm.getProductsView();
                    socketServer.emit("enviodeproducts", listadeproductos);
                } else {
                    console.error("You do not have permission to remove this product");
                }
            } else {
                console.error("Product not found");
            }
        });
        socket.on("nuevousuario",(usuario)=>{
            console.log("usuario" ,usuario)
            socket.broadcast.emit("broadcast",usuario)
            })
            socket.on("disconnect",()=>{
                console.log(`User ID: ${socket.id} is offline `)
            })
    })
};