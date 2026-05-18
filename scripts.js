if (localStorage.getItem("dark_mode") == "t") {
	toggleDarkMode();
}

function handleToggleDarkModeButton() {
	dark_mode_toggled = localStorage.getItem("dark_mode");
	if (dark_mode_toggled == "t") {
		localStorage.setItem("dark_mode", "f");

		toggleDarkMode();	
	} else {
		localStorage.setItem("dark_mode", "t");

		toggleDarkMode();	
	}
}

function toggleDarkMode() {
	var all_elements = document.getElementsByTagName("*");

	for (let i = all_elements.length - 1; i >= 0; i--) {
		const element_style = getComputedStyle(all_elements[i]);
		const element = all_elements[i];
		
		element.style.color = "rgb(from " + element_style.color + " calc(255 - r) calc(255 - g) calc(255 - b))";
		element.style.backgroundColor = "rgb(from " + element_style.backgroundColor + " calc(255 - r) calc(255 - g) calc(255 - b))";
		element.style.borderColor = "rgb(from " + element_style.borderColor + " calc(255 - r) calc(255 - g) calc(255 - b))";

		if (element.className === "left_matrix_bracket") {
			element.className = "left_matrix_bracket_dm";
		} else if (element.className === "right_matrix_bracket") {
			element.className = "right_matrix_bracket_dm";
		} else if (element.className === "line_table") {
			element.className = "line_table_dm";
		}
	}
}
