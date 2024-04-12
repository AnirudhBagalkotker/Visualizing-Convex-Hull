import { KPS, KPSSimulator } from './kirkpatrick-seidel.js';

// Function to compute convex hull
function computeKPS() {
	if (points.length < 3) {
		alert("At least 3 points are required to compute convex hull.");
		return;
	}

	convexHull = KPS(points);
	console.log(convexHull);
	redraw();
}

let stepIndex = -1, steps = null;

// Function to Simulate convex hull computation
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
		redraw();
		stepIndex++;
	}
	if (stepIndex >= steps.length) stepIndex = -1;
}

document.getElementById('simulateKPS').addEventListener('click', simulateKPS);
document.getElementById('computeKPS').addEventListener('click', computeKPS);