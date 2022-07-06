const ctn = document.getElementById("container");
const sidebar = document.getElementById("graph");
const btn = document.getElementById("toggle");
const arrow = document.getElementById("arrow");

btn.addEventListener("click", swipe);

function swipe() {
	sidebar.classList.toggle("active");
	ctn.classList.toggle("active");
	btn.classList.toggle("active");
	if (arrow.className == "arrow left") {
		arrow.className = "arrow right";
	} else {
		arrow.className = "arrow left";
	}	
}