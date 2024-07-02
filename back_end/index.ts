import express from "express";
import folderRoutes from "./routes/folder.routes"
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger-output.json');

const app = express();
app.use(express.json());
app.use("/folder", folderRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000); //port
