const fs = require("fs");
const outputFolder = "output/";
let files = fs.readdirSync(outputFolder);

for(let i = 0; i < files.length; i++) {
	let path = outputFolder + files[i];
	let stat = fs.lstatSync(path);
	if(stat.isFile()) {
		let fileText = fs.readFileSync(path, "utf8");
		let json = JSON.parse(fileText);
		let filename = json.title.replace(/[^\w\d\s]/g, "");
		filename = filename.replace(/[\s]/g, "_");
		fs.writeFileSync(outputFolder + filename + ".js", 
			`window.${filename}=${JSON.stringify(json)}`);
	}
}