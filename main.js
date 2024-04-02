import { jarvisMarch, jarvisMarchIterator } from './jarvis-march.js';
import { KPS, KPSSimulator } from './kirkpatrick-seidel.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let points = []; // Array to store points
let convexHull = []; // Array to store convex hull points

// Function to draw points on the canvas
function drawPoint(x, y, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, Math.PI * 2);
	ctx.fill();
}

// Function to draw line between two points
function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

// Function to redraw everything
function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw axes
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
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

// Event listener to display coordinates tooltip on mousemove
canvas.addEventListener('mousemove', displayCoordinatesTooltip);

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
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	points.push([x, y]);
	redraw();
});

// Function to compute convex hull
function computeConvexHull() {
	if (points.length < 3) {
		alert("At least 3 points are required to compute convex hull.");
		return;
	}

	convexHull = jarvisMarch(points);
	redraw();
}

// Function to compute convex hull
function computeConvexHullKPS() {
	if (points.length < 3) {
		alert("At least 3 points are required to compute convex hull.");
		return;
	}

	convexHull = KPS(points);
	redraw();
}

let iterator = null;

function simulateJarvisMarch() {
	if (points.length < 3) {
		alert("At least 3 points are required to compute convex hull.");
		return;
	}
	if (!iterator) iterator = jarvisMarchIterator(points);

	let { value, done } = iterator.next();
	if (done) {
		iterator = null;
	} else {
		convexHull = value.hull;
		redraw();
	}
}

let stepIndex = -1, steps = null;

function simulateKPS() {
	if (points.length < 3) {
		alert("At least 3 points are required to compute convex hull.");
		return;
	}
	if (stepIndex === -1) {
		steps = KPSSimulator(points);
		stepIndex = 0;
		console.log(steps);
	};
	if (stepIndex >= 0 && stepIndex < steps.length) {
		convexHull = steps[stepIndex].points;
		if (!(steps[stepIndex].type === "Bridged Points" && steps[stepIndex].points === null)) redraw();
		stepIndex++;
	}
	if (stepIndex === 3) computeConvexHullKPS();
}

document.getElementById('simulateJarvisMarch').addEventListener('click', simulateJarvisMarch);
document.getElementById('simulateKPS').addEventListener('click', simulateKPS);

// document.getElementById('computeConvexHull').addEventListener('click', computeConvexHull);
// document.getElementById('computeConvexHullKPS').addEventListener('click', computeConvexHullKPS);

document.addEventListener('DOMContentLoaded', function () {
	redraw();
})