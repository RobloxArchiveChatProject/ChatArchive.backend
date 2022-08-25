import bodyParser from "body-parser";
import { randomUUID } from "crypto";
import { Router } from "express";
import fs, { rmSync } from "fs";
var router = Router();

router.get("/", function (req, res) {
	res.send("GET route on things.");
});

var json_parser = bodyParser.json();
router.post("/createGroup", json_parser, function (req, res) {
	if (req.body == undefined) {
		res.send("{}");
		return;
	}
	let uuid = randomUUID();
	res.send(
		JSON.stringify({
			uuid: uuid,
		})
	);
	{
		let item = JSON.parse(
			fs.readFileSync("./src/data/filelist.json", {
				encoding: "utf-8",
				flag: "r",
			})
		);
		item.push(uuid + ".json");
		fs.writeFileSync("./src/data/filelist.json", JSON.stringify(item), {
			encoding: "utf-8",
			flag: "w",
		});
	}
	{
		let item = JSON.parse(
			fs.readFileSync("./src/data/gamelist.json", {
				encoding: "utf-8",
				flag: "r",
			})
		);
		if (item[req.body.game.toString()] == undefined)
			item[req.body.game.toString()] = [];
		item[req.body.game.toString()].push(uuid + ".json");
		fs.writeFileSync("./src/data/gamelist.json", JSON.stringify(item), {
			encoding: "utf-8",
			flag: "w",
		});
	}
	fs.writeFileSync("./src/data/" + uuid + ".json", JSON.stringify(req.body), {
		encoding: "utf-8",
		flag: "w",
	});
});
router.post("/addStream", json_parser, function (req, res) {
	let id = req.body.uuid;
	let doc = JSON.parse(
		fs.readFileSync("./src/data/" + id + ".json", { encoding: "utf-8" })
	);
	doc.data.push({ user: req.body.user, message: req.body.message });
	fs.writeFileSync("./src/data/" + id + ".json", JSON.stringify(doc), {
		encoding: "utf-8",
		flag: "w",
	});
	res.send(
		JSON.stringify({
			Success: true,
		})
	);
});

//export this router to use in our index.js
export default router;
