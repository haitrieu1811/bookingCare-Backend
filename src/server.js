import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
require("dotenv").config();

import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectDB from "./config/connectDB";

let app = express();
app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log(`Backend is runing in PORT: ${port}`);
});
