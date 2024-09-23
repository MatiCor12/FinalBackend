import ProductManager from "../dao/productsMongo.js";
import nodemailer from 'nodemailer';
import 'dotenv/config';

const pm = new ProductManager()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
};

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
                    if (user.role === 'admin') {
                        const emailSubject = `Producto eliminado: ${product.title}`;
                        const emailBody = `Estimado/a ${product.owner}, tu producto "${product.title}" ha sido eliminado por un administrador.`;
                        sendEmail(product.owner, emailSubject, emailBody);
                    }
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