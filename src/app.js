import express from 'express'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'

//Definimos el puerto
const PORT = 8080

//Nombramos la variable app con la función de expres
const app = express()

//Definimos los middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Importar las rutas que serán usadas
app.use('/api/products', ProductRouter)
app.use('/api/cart', CartRouter)


//Escuchar los cambios del servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})