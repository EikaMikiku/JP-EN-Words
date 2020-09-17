const fs = require("fs");
const https = require("https");
const crypto = require("crypto");
const outputFolder = "output/";
const URL_REGEXP = /https[^"]+/g;

let files = fs.readdirSync(outputFolder);
let hahaha = 20;
let lenlenlen = 39;
extract(hahaha);

function extract(idx) {
	if(idx > hahaha + lenlenlen) return;

	let filename = files[idx];
	console.log(files);
	console.log(filename);
	console.log(files[hahaha + lenlenlen]);
	//return;
	let filepath = outputFolder + filename;
	let fileText = fs.readFileSync(filepath, "utf8");
	let json = JSON.parse(fileText);
	if(!fs.existsSync(outputFolder + json.id)) {
		fs.mkdirSync(outputFolder + json.id);
	}
	let urls = fileText.match(URL_REGEXP);

	for(let i = 0; i < urls.length; i++) {
		console.log(urls[i]);
	}

	download(urls, 0, outputFolder + json.id + "/")
	.then(() => extract(idx + 1))
	.catch(console.log);
}

function download(list, idx, folder) {
	console.log("Doing", idx, list[idx]);
	return new Promise((resolve, reject) => {
		let url = list[idx];
		if(!url) {
			console.log("Done", idx, list.length);
			return resolve(); //done
		}
		let path = folder + encodeURIComponent(url)
		if(fs.existsSync(path)) {
			return download(list, idx + 1, folder)
			.then(resolve)
			.catch(console.log);
		}
		let file = fs.createWriteStream(path);
		let request = https.get(url, (response) => {
			console.log("Downloading", url);
			let stream = response.pipe(file);
			stream.on("finish", () => {
				setTimeout(() => {
					download(list, idx + 1, folder)
					.then(resolve)
					.catch(console.log);
				}, 500);
			});
		});
	});
}