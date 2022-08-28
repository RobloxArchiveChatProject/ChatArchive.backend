import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { name, version, author, license } = require("../package.json");
import express from "express";
import router from "./routers/archive.js";
import * as dotenv from "dotenv";
dotenv.config();

var app = express();

app.get("/", function (req, res) {
	res.send(`${name}: Build Version ${version} | Released Under ${license}`);
});

app.use("/archive", router);

app.listen(3000);
