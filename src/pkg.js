import { createRequire } from "module";
const require = createRequire(import.meta.url);
export const { name, version, author, license } = require("../package.json");
