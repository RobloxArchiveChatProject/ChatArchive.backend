import bodyParser, { json } from "body-parser";
import { randomUUID } from "crypto";
import { Router } from "express";
import fs from "fs";
import { commitFile } from "../git-actions";
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
		/**
		 * Plain Array Taxo
		 * ! Will be deprecated soon!
		 */
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
		/**
		 * Gameid based Taxo
		 */
		let item = JSON.parse(
			fs.readFileSync("./src/data/gamelist.json", {
				encoding: "utf-8",
				flag: "r",
			})
		);
		if (item[req.body.game] == undefined) item[req.body.game] = [];
		item[req.body.game].push(uuid + ".json");
		fs.writeFileSync("./src/data/gamelist.json", JSON.stringify(item), {
			encoding: "utf-8",
			flag: "w",
		});
	}
	{
		/**
		 * Owner-based Taxo
		 */
		let item = JSON.parse(
			fs.readFileSync("./src/data/ownerlist.json", {
				encoding: "utf-8",
				flag: "r",
			})
		);
		let found = false;
		item.forEach((v, i) => {
			if (found) return;
			if (v.userId === req.body.owner.userId) {
				v.uuid.push(uuid + ".json");
				found = true;
				return;
			}
		});
		if (!found) {
			item.push({
				userId: req.body.owner.userId,
				name: req.body.owner.name,
				uuid: [uuid + ".json"],
			});
		}
		fs.writeFileSync("./src/data/ownerlist.json", JSON.stringify(item), {
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
router.post("/push", json_parser, async function (req, res) {
	let id = req.body.uuid;
	commitFile(id + ".json");
});
router.post("/finish", json_parser, async function (req, res) {
	commitFile("filelist.json");
	commitFile("gamelist.json");
	commitFile("ownerlist.json");
});

//export this router to use in our index.js
export default router;
