// scripts/write-version.js
const { version } = require("../package.json");
const fs = require("fs");
fs.writeFileSync("./app/version.json", JSON.stringify({ version }));
