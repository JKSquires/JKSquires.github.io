const code_elements = document.getElementsByTagName("code");

const delimiters = [',', ' ', '(', ')', '[', ']', '{', '}', '+', '-', '*', '/', '>', '<', '='];

function splitAndKeep(str, spl_lst) {
	let r = [];

	let sec = "";
	for (let i = 0; i < str.length; i++) {
		let c = str[i];

		let found = false;
		for (let spl of spl_lst) {
			if (c === spl) {
				found = true;

				r.push(sec);
				r.push(c);
				sec = "";
			}
		}

		if (!found) {
			sec += c;
		}
	}

	r.push(sec);

	return r;
}

function createColorTextObject(t, c) {
	return {
		text: t,
		color: c
	};
}

let code_text = [];
for (let i = 0; i < code_elements.length; i++) {
	code_text[i] = code_elements[i].innerHTML;
}

code_text = code_text.map((t) => {
	let lines = t.split('\n');
	lines = lines.map((l) => {
		let line = splitAndKeep(l.replaceAll("&lt;", "<").replaceAll("&gt;", ">"), [';']);

		line[0] = splitAndKeep(line[0], delimiters);

		if (line[0] == "") {
			line[0] = createColorTextObject("", "#000");
		} else {
			// color the text before comments
			line[0] = line[0].map((sec) => {
				// check for number (dec, hex, bin)
				if ((sec[0] == '%' || sec[0] == '$') || /^[0-9]/.test(sec) || sec.length > 1 && (sec.substring(0,2) == "0x" || sec.substring(0,2) == "0b")) {
					return createColorTextObject(sec, "#090");
				} // still need to check for decimal numbers

				// check for register
				if (/^r+[0-9]/.test(sec)) {
					return createColorTextObject(sec, "#900");
				}

				return createColorTextObject(sec, "#000");
			});
		}

		// color the comments
		for (let i = 1; i < line.length; i++) {
			line[i] = createColorTextObject(line[i], "#777");
		}

		return line;
	});

	return lines;
});

let codes = [];
for (let code_i = 0; code_i < code_text.length; code_i++) {
	codes[code_i] = "";

	for (let line_i = 0; line_i < code_text[code_i].length; line_i++) {
		for (let word_i = 0; word_i < code_text[code_i][line_i][0].length; word_i++) {
			codes[code_i] += "<span style='color:" + code_text[code_i][line_i][0][word_i].color + "'>" + code_text[code_i][line_i][0][word_i].text.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + "</span>";
		}

		let comment = "<span style='color:#777'>";
		for (let comment_i = 1; comment_i < code_text[code_i][line_i].length; comment_i++) {
			comment += code_text[code_i][line_i][comment_i].text;
		}
		comment += "</span>";

		codes[code_i] += comment + "\n";
	}

	code_elements[code_i].innerHTML = codes[code_i];
}

