import express from "express"
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import viewsRoutes from './routes/viewsRoutes.js'
import messagesRouter from './routes/messageRoutes.js'
import {Server} from "socket.io"
import { engine } from "express-handlebars"
import __dirname from "./utils.js"
import 'dotenv/config'
import { dbConnection } from "./config/config.js"
import MessageManager from './class/ChatManager.js'
import { addProductModerate, getProductsModerate } from "./moderate/products.js"

//Nombramos la variable app con la función de expres
const app = express()
//Definimos el puerto
const PORT= process.env.PORT


const messageManager = new MessageManager()

//Definimos los middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Uso de handlebars
app.engine('handlebars', engine())
app.set('views',__dirname + '/views')
app.set('view engine','handlebars')

//Static
app.use(express.static(__dirname + "/public"))

//Importar las rutas que serán usadas
app.use('/api/products',productRoutes)
app.use('/api/carts', cartRoutes)
app.use('/', viewsRoutes)
app.use('/chats', messagesRouter)

//Base de datos conectamos

await dbConnection()

//Escuchar los cambios del servidor y socket

const expressServer = app.listen(PORT, () => {console.log(`Running application in the port ${PORT}`);});
const io = new Server(expressServer)

io.on('connection', async(socket) => {

    const {payload} = await getProductsModerate({})
    const productos = payload
    socket.emit('products', payload);

    socket.on('addProducto', async (product)=> {
        const newProduct = await addProductModerate({...product});
        if(newProduct) {
            productos.push(newProduct)
            socket.emit('products', productos);
        }
    });

    messageManager.getChats()
        .then(chats => {
            socket.emit('mensaje', chats)
        })

    socket.on('addMensaje', data => {
        console.log(data);
        messageManager.addMessage(data)
            .then(() => {
                messageManager.getChats()
                    .then(chats => {
                        socket.emit('mensaje', chats)
                    })
            })
})
})