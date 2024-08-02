import express from "express";
import { config } from "dotenv";
import {connection_db} from "./DB/connection.js";
import * as router from "./src/Modules/index.js";
import { globaleResponse } from "./src/Middlewares/index.js";

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/categories", router.categoryRouter);

app.use(globaleResponse);


connection_db();
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
