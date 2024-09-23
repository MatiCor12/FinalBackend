import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import viewsRoutes from './routes/viewsRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { __dirname } from './utils.js';
import { dbConnection } from './config/config.js';
import { initializePassport } from './config/passport.js';
import { socketProducts } from './listener/socketProducts.js';
import { socketChat }from './listener/socketChat.js';

//Base de datos conectamos
await dbConnection();

//Nombramos la variable app con la función de expres
const app = express();
//Definimos el puerto
const PORT = process.env.PORT;

app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.URL_MONGODB }),
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
}));

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:"Documentacion",
            description:"Api clase swagger",
        },
    },
    apis:[`src/docs/**/*.yaml`],
}
const specs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Paspport
app.use(passport.initialize());
app.use(passport.session());

//Definimos los middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Static
app.use(express.static(__dirname + '/public'));

// Middleware para pasar la información del usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//Uso de handlebars
app.engine('handlebars', engine({
    helpers: {
        json: function(context) {
            return JSON.stringify(context);
        },
        eq: function(a, b) {
            return a === b;
        },
        or: function(v1, v2, options) {
            return v1 || v2;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));

// Configuración de Express para renderizar vistas con handlebars
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

//Importar las rutas que serán usadas
app.use('/', viewsRoutes);
app.use('/api', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/sessions', userRoutes);

initializePassport();
const httpServer = app.listen(PORT, () => {
    console.log(`Running application in the port ${PORT}`);
});

//Escuchar los cambios del servidor y socket
const socketServer = new Server(httpServer);

socketProducts(socketServer);
socketChat(socketServer);