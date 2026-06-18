const lang_disp = document.getElementById("lang-disp");

async function getLangs() {
	const sum_langs = {};
	let failed = false;

	const repo_api = await fetch("https://api.github.com/users/JKSquires/repos");
	if (repo_api.ok) {
		const repos = await repo_api.json();

		const lang_data = await Promise.all(repos.map((repo) =>
			fetch("https://api.github.com/repos/JKSquires/" + repo.name + "/languages")
				.then((res) => {
					if (res.ok) {
						return res.json()
					} else {
						failed = true;
						return null;
					}
				})
		));

		if (!failed) {
			for (const langs of lang_data) {
				for (const lang in langs) {
					if (sum_langs[lang]) {
						sum_langs[lang] += langs[lang];
					} else {
						sum_langs[lang] = langs[lang]
					}
				}
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

	if (!stat.failed || localStorage.getItem("langs_last_accessed")) {
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

		const rows = sum_langs_sort.map((lang) =>
			"<tr><td>" + lang[0] + "</td><td><strong>"
			+ (Math.round((lang[1] / total_bytes) * 10000) / 100) + "%</strong></td><td>"
			+ lang[1] + "</td></tr>"
		);

		text += rows.join("") + "<tr><td>--</td><td><strong>100%</strong></td><td>" + total_bytes + "</td>";
	}

	lang_disp.innerHTML = text;
});
