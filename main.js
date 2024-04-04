const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let points = []; // Array to store points
let convexHull = []; // Array to store convex hull points

// Function to draw points on the canvas
function drawPoint(x, y, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x + canvas.width / 2, canvas.height / 2 - y, 3, 0, Math.PI * 2);
	ctx.fill();
}

// Function to draw line between two points
function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1 + canvas.width / 2, canvas.height / 2 - y1);
	ctx.lineTo(x2 + canvas.width / 2, canvas.height / 2 - y2);
	ctx.stroke();
}

// Function to redraw everything
function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw axes
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();

	// Draw convex hull
	ctx.strokeStyle = 'red';
	for (let i = 0; i < convexHull.length - 1; i++) {
		drawLine(convexHull[i][0], convexHull[i][1], convexHull[i + 1][0], convexHull[i + 1][1]);
	}
	if (convexHull.length > 2) {
		drawLine(convexHull[convexHull.length - 1][0], convexHull[convexHull.length - 1][1], convexHull[0][0], convexHull[0][1]);
	}

	// Draw points
	ctx.fillStyle = 'blue';
	points.forEach(point => {
		drawPoint(point[0], point[1], 'blue');
	});
}

// Function to display coordinates tooltip
function displayCoordinatesTooltip(event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left - canvas.width / 2;
	const y = -(event.clientY - rect.top - canvas.height / 2);

	let tooltip = document.getElementById('tooltip');
	if (!tooltip) {
		tooltip = document.createElement('div');
		tooltip.id = 'tooltip';
		tooltip.style.position = 'absolute';
		tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		tooltip.style.color = 'white';
		tooltip.style.padding = '5px';
		tooltip.style.borderRadius = '5px';
		document.body.appendChild(tooltip);
	}

	tooltip.innerText = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
	tooltip.style.left = `${event.pageX + 10}px`;
	tooltip.style.top = `${event.pageY - 25}px`;
}


// Function to clear the canvas
function clearCanvas() {
	points = [];
	convexHull = [];
	redraw();
}

// Function to generate random points
function generateRandomPoints() {
	const radiusX = 290;
	const radiusY = 900;
	for (let i = 0; i < 50; i++) {
		let x, y;
		do {
			x = Math.random() * (2 * radiusY) - radiusY;
			y = Math.random() * (2 * radiusX) - radiusX;
		} while (x ** 2 + y ** 2 > ((radiusX + radiusY) / 2) ** 2);
		points.push([x, y]);
	}
	console.log(points);
	redraw();
}

// Event listener to remove tooltip when mouse leaves canvas
canvas.addEventListener('mouseleave', function () {
	let tooltip = document.getElementById('tooltip');
	if (tooltip) {
		tooltip.remove();
	}
});

// Function to add point on canvas click
canvas.addEventListener('click', function (event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left - canvas.width / 2;
	const y = -(event.clientY - rect.top - canvas.height / 2);
	points.push([x, y]);
	redraw();
});

// Event listener to display coordinates tooltip on mousemove
canvas.addEventListener('mousemove', displayCoordinatesTooltip);
// Event listener to clear the canvas
document.getElementById('clear').addEventListener('click', clearCanvas);
// Event listener to generate random points
document.getElementById('generate').addEventListener('click', generateRandomPoints);

document.addEventListener('DOMContentLoaded', function () { redraw(); });