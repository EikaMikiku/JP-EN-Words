function Learn() {
	this.viewButton = document.getElementById("view-button");
	this.trainButton = document.getElementById("train-button");
	this.testButton = document.getElementById("test-button");
	this.courseSelect = document.getElementById("course-select");

	this.viewContent = document.getElementById("view-content");
	this.trainContent = document.getElementById("train-content");
	this.testContent = document.getElementById("test-content");

	this.jsLocation = "./extracted/";
	this.bindEvents();
}

Learn.prototype.bindEvents = function() {
	this.viewButton.onclick = (e) => {
		this.clearCourse();
		this.loadCourse((e) => this.viewCourse(window[this.courseSelect.value]));
	};
	this.trainButton.onclick = (e) => {
		this.clearCourse();
		this.loadCourse((e) => this.trainCourse(window[this.courseSelect.value]));
	};
	this.testButton.onclick = (e) => {
		this.clearCourse();
		this.loadCourse((e) => this.testCourse(window[this.courseSelect.value]));
	};
};

Learn.prototype.trainCourse = function() {

};

Learn.prototype.testCourse = function() {

};

Learn.prototype.loadCourse = function(cb) {
	let script = document.createElement("script");
	script.onload = cb;
	script.src = this.jsLocation + this.courseSelect.value + ".js";
	document.head.appendChild(script);
};

Learn.prototype.viewCourse = function(json) {
	let courseId = json.id;
	let items = json.goal_items;
	for(let i = 0; i < items.length; i++) {
		setTimeout(() => this.viewItem(courseId, items[i]), i * 50);
	}
};
Learn.prototype.clearCourse = function() {
	while(this.viewContent.firstChild) {
		this.viewContent.removeChild(this.viewContent.firstChild);
	}
	while(this.trainContent.firstChild) {
		this.trainContent.removeChild(this.trainContent.firstChild);
	}
	while(this.testContent.firstChild) {
		this.testContent.removeChild(this.testContent.firstChild);
	}
};
Learn.prototype.viewItem = function(courseId, item) {
	let word = document.createElement("word");
	word.className = "row";
	let basic = document.createElement("basic");
	basic.className = "col-4";
	let basicDiv = document.createElement("div");

	//Sound
	let sound = document.createElement("sound");
	let audio = new Audio(
		this.jsLocation + courseId + "/" +
		encodeURIComponent(encodeURIComponent(item.sound))
	);
	sound.innerText = "🔇";
	audio.oncanplay = (e) => sound.innerText = "🔊";
	basic.onclick = (e) => audio.play();
	basic.appendChild(sound);

	//Div
	let jp1 = document.createElement("japanese");
	jp1.innerText = item.item.cue.text;
	basicDiv.appendChild(jp1);
	let hira = item.item.cue.transliterations.Hira;
	let hrkt = item.item.cue.transliterations.Hrkt;
	if(hrkt) {
		let h = document.createElement("japanese");
		h.innerText = hrkt;
		basicDiv.appendChild(h);
	} else if(hira) {
		let h = document.createElement("japanese");
		h.innerText = hira;
		basicDiv.appendChild(h);
	}

	let eng = document.createElement("english");
	eng.innerText = this.capitalise(item.item.response.text);
	basicDiv.appendChild(eng);
	basic.appendChild(basicDiv);

	//Type
	let part = document.createElement("type");
	part.innerText = item.item.cue.part_of_speech;
	basic.appendChild(part);

	//sentences
	let sentences = document.createElement("sentences");
	sentences.className = "col";
	for(let i = 0; i < item.sentences.length; i++) {
		let sentence = document.createElement("sentence");
		//Sound
		let ss = document.createElement("sound");
		let sa = new Audio(
			this.jsLocation + courseId + "/" +
			encodeURIComponent(encodeURIComponent(item.sentences[i].sound))
		);
		ss.innerText = "🔊";
		ss.innerText = "🔇";
		sa.oncanplay = (e) => {
			ss.innerText = "🔊";
		};
		sentence.onclick = (e) => sa.play();
		sentence.appendChild(ss);
		//Div
		let sentenceDiv = document.createElement("div");
		let jp = document.createElement("japanese");
		jp.innerHTML = item.sentences[i].cue.text;
		sentenceDiv.appendChild(jp);
		let hira = item.sentences[i].cue.transliterations.Hira;
		let hrkt = item.sentences[i].cue.transliterations.Hrkt;
		if(hrkt) {
			let h = document.createElement("japanese");
			h.innerHTML = hrkt;
			sentenceDiv.appendChild(h);
		} else if(hira) {
			let h = document.createElement("japanese");
			h.innerHTML = hira;
			sentenceDiv.appendChild(h);
		}
		let eng = document.createElement("english");
		eng.innerHTML = item.sentences[i].response.text;
		sentenceDiv.appendChild(eng);
		sentence.appendChild(sentenceDiv);
		sentences.appendChild(sentence);
	}

	word.appendChild(basic);
	word.appendChild(sentences);
	this.viewContent.appendChild(word);
};
Learn.prototype.capitalise = function(str) {
	return str[0].toUpperCase() + str.slice(1);
};