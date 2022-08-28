import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";
import { promises as fs } from "fs";

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

const configs = {
	owner: "rblxacp",
	repo: "ChatArchive.backend",
};

async function getSHA(path) {
	const result = await octokit.repos.getContent({
		...configs,
		path,
	});
	const sha = result?.data?.sha;

	return sha;
}

export async function commitFile(filename) {
	const path = `src/data/${filename}`;
	const sha = await getSHA(path);

	const filedata = await fs.readFile(`./src/data/${filename}`, {
		encoding: "utf-8",
	});
	const result = await octokit.repos.createOrUpdateFileContents({
		...configs,
		path,
		message: `Auto commit - ${filename}`,
		content: Base64.encode(filedata),
		sha,
	});
	return result?.status || 500;
}
