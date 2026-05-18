const lang_disp = document.getElementById("lang-disp");

async function getLangs() {
	const sum_langs = {};
	let failed = false;

	const repo_api = await fetch("https://api.github.com/users/JKSquires/repos");
	if (repo_api.ok) {
		const repos = await repo_api.json();

		for (let i = 0; i < repos.length; i++) {
			const lang_api = await fetch("https://api.github.com/repos/JKSquires/" + repos[i].name + "/languages");

			if (lang_api.ok) {
				const langs = await lang_api.json();

				for (const lang in langs) {
					if (sum_langs[lang]) {
						sum_langs[lang] += langs[lang];
					} else {
						sum_langs[lang] = langs[lang]
					}
				}
			} else {
				failed = true;

				break;
			}
		}
	} else {
		failed = true;
	}

	return { sum_langs, failed };
}

getLangs().then((stat) => {
	let text = "<tr><th>Language</th><th>Percentage</th><th>Bytes</th></tr>";

	let sum_langs;

	if (stat.failed) {
		console.log("Failed to access full API. Client may have been rate limited. Attempting to use last accessed data...");

		const langs_last_accessed = localStorage.getItem("langs_last_accessed");
		if (langs_last_accessed) {
			sum_langs = JSON.parse(langs_last_accessed);
		} else {
			text = "<tr><td>Failed to access API. Try again later.</td></tr>";
			sum_langs = {};
		}
	} else {
		localStorage.setItem("langs_last_accessed", JSON.stringify(stat.sum_langs));

		sum_langs = stat.sum_langs;
	}

	let sum_langs_sort = [];
	for (const lang in sum_langs) {
		sum_langs_sort.push([lang, sum_langs[lang]]);
	}
	sum_langs_sort = sum_langs_sort.sort((a, b) => {
		return b[1] - a[1];
	});

	let total_bytes = 0;
	for (let i = 0; i < sum_langs_sort.length; i++) {
		total_bytes += sum_langs_sort[i][1];
	}

	for (let i = 0; i < sum_langs_sort.length; i++) {
		const percent = Math.round((sum_langs_sort[i][1] / total_bytes) * 10000) / 100;
		text += "<tr><td>" + sum_langs_sort[i][0] + "</td><td><strong>" + percent + "%</strong></td><td>" + sum_langs_sort[i][1] + "</td></tr>";
	}

	if (!stat.failed) {
		text += "<tr><td>--</td><td><strong>100%</strong></td><td>" + total_bytes + "</td>";
	}

	lang_disp.innerHTML = text;
});
