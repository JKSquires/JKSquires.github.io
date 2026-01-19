if (localStorage.getItem("dark_mode") == "t") {
	toggleDarkMode();
}

function handleToggleDarkModeButton() {
	dark_mode_toggled = localStorage.getItem("dark_mode");
	if (dark_mode_toggled == "t") {
		localStorage.clear();
		location.reload();
	} else {
		dark_mode_toggled = "t";

		localStorage.setItem("dark_mode", dark_mode_toggled);

		toggleDarkMode();	
	}
}

function toggleDarkMode() {
	var all_elements = document.getElementsByTagName("*");

	for (let i = all_elements.length - 1; i >= 0; i--) {
		let element_style = getComputedStyle(all_elements[i]);
		
		all_elements[i].style.color = "rgb(from " + element_style.color + " calc(255 - r) calc(255 - g) calc(255 - b))";
		all_elements[i].style.backgroundColor = "rgb(from " + element_style.backgroundColor + " calc(255 - r) calc(255 - g) calc(255 - b))";
		all_elements[i].style.borderColor = "rgb(from " + element_style.borderColor + " calc(255 - r) calc(255 - g) calc(255 - b))";

		if (all_elements[i].className === "left_matrix_bracket") {
			all_elements[i].className = "left_matrix_bracket_dm";
		} else if (all_elements[i].className === "right_matrix_bracket") {
			all_elements[i].className = "right_matrix_bracket_dm";
		}
	}
}
