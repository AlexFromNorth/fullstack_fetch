import express from "express";
import folderRoutes from "./routes/folder.routes";
import { Server } from "http";
import cors from "cors"; // Импортируем cors
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger-output.json');

const app = express();

app.use(cors()); // Используем cors
app.use(express.json());
app.use("/folder", folderRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = app.listen(3000); // Используем переменную server для io

var io = require('socket.io')(server, { // Используем переменную server вместо Server
    cors: {
        origin: true,
        credentials: true,
    },
    allowEIO3: true,
});
