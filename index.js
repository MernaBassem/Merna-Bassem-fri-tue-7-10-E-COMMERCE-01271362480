import express from "express";
import { config } from "dotenv";
import {connection_db} from "./DB/connection.js";
import * as router from "./src/Modules/index.js";
import { globaleResponse } from "./src/Middlewares/index.js";

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
// categories routes
app.use("/categories", router.categoryRouter);
// sub categories routes
app.use("/subCategories", router.SubCategoryRouter);
// brand routes
app.use("/brands", router.brandRouter);
// product routes
app.use("/products", router.ProductRouter);
app.use(globaleResponse);


connection_db();
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
