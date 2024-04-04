import { jarvisMarch, jarvisMarchIterator } from './jarvis-march.js';

// Function to compute convex hull using Jarvis March
function computeJarvisMarch() {
	if (points.length < 3) {
		alert("At least 3 points are required to compute convex hull.");
		return;
	}

	convexHull = jarvisMarch(points);
	redraw();
}

let iterator = null;

// Function to Simulate convex hull computation
function simulateJarvisMarch() {
	if (points.length < 3) {
		alert("At least 3 points are required to compute convex hull.");
		return;
	}
	if (!iterator) iterator = jarvisMarchIterator(points);

	let { value, done } = iterator.next();
	if (done) iterator = null;
	else {
		convexHull = value.hull;
		redraw();
	}
}

document.getElementById('simulateJarvisMarch').addEventListener('click', simulateJarvisMarch);
document.getElementById('computeJarvisMarch').addEventListener('click', computeJarvisMarch);
