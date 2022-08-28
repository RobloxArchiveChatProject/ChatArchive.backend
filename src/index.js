import { createRequire } from "module";
import express from "express";
import router from "./routers/archive.js";
import { name, version, license } from "./pkg.js";

var app = express();

app.get("/", function (req, res) {
	res.send(`${name}: Build Version ${version} | Released Under ${license}`);
});

app.use("/archive", router);

app.listen(3000);
