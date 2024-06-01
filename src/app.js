import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';

import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
const PORT = process.env.PORT||8080;

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());



const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`));
const socketServer = new Server(server);

//Propuesta para conectar socket.io con un request habitual GET POST PUT DELETE etc
// app.use((req,res,next)=>{
//     req.io = socketServer
//     next();
// })

app.use('/',viewsRouter);

const messages = [];

socketServer.on('connection',(socketClient)=>{
    //callback a ejecutar.
    console.log("Cliente conectado con id: ",socketClient.id);

    //Si llegó a este punto, el usuario ahora está listo para chatear.
    socketServer.emit('log',messages);

    socketClient.on('authenticated',data=>{
        //El server lo envía a TODOS
        //El socketClient, lo envía únicamente al cliente.
        //El socket BROADCAST lo envía a TODOS, menos al cliente.
        socketClient.broadcast.emit('newUserConnected',data)
    })

    socketClient.on("message",data=>{
        console.log(data);
        messages.push(data);
        //Ojito con el emit
        socketServer.emit('log',messages)
    })
})