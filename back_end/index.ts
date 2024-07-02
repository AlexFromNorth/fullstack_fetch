import express from "express";
import folderRoutes from "./routes/folder.routes"

const app = express();
app.use(express.json());
app.use("/folder", folderRoutes)



app.listen(3000); //port
