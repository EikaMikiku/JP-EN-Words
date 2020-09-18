function Learn() {
	this.viewButton = document.getElementById("view-button");
	this.trainButton = document.getElementById("train-button");
	this.courseSelect = document.getElementById("course-select");

	this.viewContent = document.getElementById("view-content");
	this.trainContent = document.getElementById("train-content");

	this.timers = [];

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
};

Learn.prototype.loadCourse = function(cb) {
	let script = document.createElement("script");
	script.onload = cb;
	script.src = this.jsLocation + this.courseSelect.value + ".js";
	document.head.appendChild(script);
};

Learn.prototype.trainCourse = async function(json) {
	let courseId = json.id;
	let items = json.goal_items;
	//Shuffle items
	for (let i = items.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[items[i], items[j]] = [items[j], items[i]];
	}
	//Show one at a time
	for(let i = 0; i < items.length; i++) {
		this.clearCourse();
		await this.trainItem(courseId, items[i]);
	}

	let finished = document.createElement("p");
	finished.innerText = "Finished [" + json.title + "].";
	this.trainContent.appendChild(finished);
};

Learn.prototype.trainItem = async function(courseId, item) {
	return new Promise((resolve, reject) => {
		//Show single item
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
		sound.innerText = "🔊";
		audio.oncanplay = (e) => {
			audio.play();
		};
		basic.onclick = (e) => audio.play();
		basic.appendChild(sound);

		//Div
		let jp1 = document.createElement("japanese");
		jp1.innerText = item.item.cue.text;
		basicDiv.appendChild(jp1);
		let hira = item.item.cue.transliterations.Hira;
		let hrkt = item.item.cue.transliterations.Hrkt;
		if(hrkt && hrkt !== item.item.cue.text) {
			let h = document.createElement("japanese");
			h.innerText = hrkt;
			basicDiv.appendChild(h);
		} else if(hira && hira !== item.item.cue.text) {
			let h = document.createElement("japanese");
			h.innerText = hira;
			basicDiv.appendChild(h);
		}

		let eng = document.createElement("english");
		eng.className = "text-hidden";
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
			sentence.onclick = (e) => sa.play();
			sentence.appendChild(ss);
			//Div
			let sentenceDiv = document.createElement("div");
			let jp = document.createElement("japanese");
			jp.innerHTML = item.sentences[i].cue.text;
			sentenceDiv.appendChild(jp);

			let eng = document.createElement("english");
			eng.className = "text-hidden";
			eng.innerHTML = item.sentences[i].response.text;
			sentenceDiv.appendChild(eng);
			sentence.appendChild(sentenceDiv);
			sentences.appendChild(sentence);
		}

		word.appendChild(basic);
		word.appendChild(sentences);
		this.trainContent.appendChild(word);

		//Next button
		let btn = document.createElement("button");
		btn.innerText = "Show answer";
		btn.onclick = () => {
			if(btn.innerText === "Show answer") {
				let hidden = word.querySelectorAll(".text-hidden");
				for(let i = 0; i < hidden.length; i++) {
					hidden[i].classList.remove("text-hidden");
				}
				btn.innerText = "Show next";
			} else if(btn.innerText === "Show next") {
				resolve();
				btn.parentElement.removeChild(btn);
			}
		};
		this.trainContent.appendChild(word);
		this.trainContent.appendChild(btn);
	});
};

Learn.prototype.viewCourse = function(json) {
	let courseId = json.id;
	let items = json.goal_items;
	this.timers = [];
	for(let i = 0; i < items.length; i++) {
		this.timers[i] = setTimeout(() => this.viewItem(courseId, items[i]), i * 60);
	}
};

Learn.prototype.clearCourse = function() {
	//Clear timers
	for(let i = 0; i < this.timers.length; i++) {
		clearTimeout(this.timers[i]);
	}
	this.timers = [];

	while(this.viewContent.firstChild) {
		this.viewContent.removeChild(this.viewContent.firstChild);
	}
	while(this.trainContent.firstChild) {
		this.trainContent.removeChild(this.trainContent.firstChild);
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
	if(hrkt && hrkt !== item.item.cue.text) {
		let h = document.createElement("japanese");
		h.innerText = hrkt;
		basicDiv.appendChild(h);
	} else if(hira && hira !== item.item.cue.text) {
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
		if(hrkt && hrkt.replace(/\s/g, "") !== item.sentences[i].cue.text) {
			let h = document.createElement("japanese");
			h.innerHTML = hrkt;
			sentenceDiv.appendChild(h);
		} else if(hira && hira.replace(/\s/g, "") !== item.sentences[i].cue.text) {
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