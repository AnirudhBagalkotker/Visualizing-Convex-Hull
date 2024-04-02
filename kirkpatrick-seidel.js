/**
 * Returns a new array of points with the x and y coordinates flipped.
 *
 * @param {Array<Array<number>>} points - The array of points to be flipped.
 * @return {Array<Array<number>>} - The new array of points with flipped coordinates.
 */
export function flipped(points) {
	return points.map(point => [-point[0], -point[1]]);
}

export function quickSelect(ls, index, lo = 0, hi = null, depth = 0) {
	if (hi === null) {
		/**
		 * Selects the element at the specified index in a given list using the quickselect algorithm.
		 *
		 * @param {Array} ls - The list of elements.
		 * @param {number} index - The index of the element to select.
		 * @param {number} [lo=0] - The starting index of the sublist to consider.
		 * @param {number|null} [hi=null] - The ending index of the sublist to consider.
		 * @param {number} [depth=0] - The depth of recursion.
		 * @return {*} The element at the specified index.
		 */
		hi = ls.length - 1;
	}
	if (lo === hi) {
		return ls[lo];
	}
	const pivot = Math.floor(Math.random() * (hi - lo + 1) + lo);
	[ls[lo], ls[pivot]] = [ls[pivot], ls[lo]];
	let cur = lo;
	for (let run = lo + 1; run <= hi; run++) {
		if (ls[run] < ls[lo]) {
			cur++;
			[ls[cur], ls[run]] = [ls[run], ls[cur]];
		}
	}
	[ls[cur], ls[lo]] = [ls[lo], ls[cur]];
	if (index < cur) {
		return quickSelect(ls, index, lo, cur - 1, depth + 1);
	} else if (index > cur) {
		return quickSelect(ls, index, cur + 1, hi, depth + 1);
	} else {
		return ls[cur];
	}
}

/**
 * Bridges points based on given criteria.
 *
 * @param {array} points - The points to bridge.
 * @param {number} verticalLine - The vertical line to bridge the points on.
 * @return {array|null} The bridged points or null if no valid bridges are found.
 */
export function bridge(points, verticalLine) {
	if (!points || points.length === 0) {
		return null; // No points to bridge
	}

	let candidates = new Set();
	if (points.length === 2) {
		return points.sort();
	}
	let pairs = [];
	const modifySet = new Set(points.map(point => [...point]))
	while (modifySet.size >= 2) {
		pairs.push([...modifySet].sort());
		modifySet.delete(...pairs.pop());
	}
	if (modifySet.size === 1) {
		candidates.add([...modifySet].pop());
	}
	let slopes = [];
	for (let [pi, pj] of pairs) {
		const pi = pairs[i][0];
		const pj = pairs[i][1];
		if (pi[0] === pj[0]) {
			pairs.splice(i, 1);
			candidates.add(pi[1] > pj[1] ? pi : pj);
		} else {
			slopes.push((pi[1] - pj[1]) / (pi[0] - pj[0]));
		}
	}
	if (slopes.length === 0) {
		return null; // No valid slopes
	}
	let medianIndex = Math.floor(slopes.length / 2) - (slopes.length % 2 === 0 ? 1 : 0);
	let medianSlope = quickSelect(slopes.slice(), medianIndex);
	const small = new Set();
	const equal = new Set();
	const large = new Set();
	for (let i = 0; i < slopes.length; i++) {
		if (slopes[i] < medianSlope) {
			small.add(pairs[i]);
		} else if (slopes[i] === medianSlope) {
			equal.add(pairs[i]);
		} else {
			large.add(pairs[i]);
		}
	}
	const maxSlope = Math.max(...points.map(point => point[1] - medianSlope * point[0]));
	const maxSet = points.filter(point => point[1] - medianSlope * point[0] === maxSlope);

	const left = Math.min(...maxSet.map(point => point[0]));
	const right = Math.max(...maxSet.map(point => point[0]));

	if (left[0] <= verticalLine && right[0] > verticalLine) {
		return [left, right];
	}

	if (right[0] <= verticalLine) {
		for (const pair of [...large, ...equal]) {
			candidates.add(pair[0]);
			candidates.add(pair[1]);
		}
		for (const pair of small) {
			candidates.add(pair[0]);
			candidates.add(pair[1]);
		}
	}

	if (left > verticalLine) {
		for (const pair of [...small, ...equal]) {
			candidates.add(pair[0]);
			candidates.add(pair[1]);
		}
		for (const pair of large) {
			candidates.add(pair[0]);
			candidates.add(pair[1]);
		}
	}

	return bridge([...candidates], verticalLine);
}

/**
 * Sorts an array of points by their x-coordinate and returns the upper hull of the points.
 *
 * @param {Array<Array<number>>} points - The array of points to compute the upper hull for.
 * @return {Array<Array<number>>} - The upper hull of the points.
 */
export function upperHull(points) {
	points.sort((a, b) => a[0] - b[0]); // Sort points by x-coordinate

	const upper = [];
	for (const p of points) {
		while (
			upper.length >= 2 &&
			(p[0] - upper[upper.length - 2][0]) *
			(upper[upper.length - 1][1] - upper[upper.length - 2][1]) -
			(p[1] - upper[upper.length - 2][1]) *
			(upper[upper.length - 1][0] - upper[upper.length - 2][0]) >= 0) {
			upper.pop();
		}
		upper.push(p);
	}
	return upper;
}

/**
 * Connects points within the lower and upper bounds to create a bridge.
 *
 * @param {Array} lower - the lower bound point
 * @param {Array} upper - the upper bound point
 * @param {Array} points - the points to be connected
 * @return {Array} an array of connected points
 */
export function connect(lower, upper, points) {
	if (lower[0] === upper[0]) {
		return [lower];
	}

	points = points.filter(
		p => p[0] < lower[0] || p[0] > upper[0]
	); // Filter points outside lower and upper bounds

	if (!points.length) {
		return [lower, upper];
	}

	const maxLeft = points.reduce((prev, curr) =>
		curr[0] > prev[0] && curr[1] <= prev[1] ? curr : prev
	); // Find max x, min y point

	const minRight = points.reduce((prev, curr) =>
		curr[0] < prev[0] && curr[1] <= prev[1] ? curr : prev
	); // Find min x, min y point

	const bridgeResult = bridge(points, (maxLeft[0] + minRight[0]) / 2);

	if (!bridgeResult) {
		return [lower, upper];
	}

	const left = bridgeResult[0];
	const right = bridgeResult[1];

	const pointsLeft = points.filter(p => p[0] < left[0]);
	const pointsRight = points.filter(p => p[0] > right[0]);

	return connect(lower, left, pointsLeft).concat(connect(right, upper, pointsRight));
}

/**
 * Calculate the convex hull of a set of points using the Kirkpatrick–Seidel algorithm.
 *
 * @param {Array} points - The array of points for which to calculate the convex hull.
 * @return {Array} The array of points representing the convex hull.
 */
export function KPS(points) {
	const upper = upperHull(points.slice());
	const lower = flipped(upperHull(flipped(points.slice())));

	if (upper[upper.length - 1][0] === lower[0][0] && upper[upper.length - 1][1] === lower[0][1]) {
		upper.pop();
	}

	if (upper[0][0] === lower[lower.length - 1][0] && upper[0][1] === lower[lower.length - 1][1]) {
		lower.pop();
	}

	return upper.concat(lower);
}

/**
 * Simulates each step of the Kirkpatrick-Seidel algorithm.
 * 
 * @param {Array} points - The array of points for which to compute the convex hull.
 * @return {Array} An array containing intermediate steps of the algorithm.
 */
export function KPSSimulator(points) {
	const steps = [];

	// Compute upper hull
	const upper = upperHull(points.slice());
	steps.push({ type: 'Upper Hull', points: upper.slice() });

	// Compute lower hull
	const lower = flipped(upperHull(flipped(points.slice())));
	steps.push({ type: 'Lower Hull', points: lower.slice() });

	// Bridge upper and lower hulls
	const bridgedPoints = bridge([...upper, ...lower], 0);
	steps.push({ type: 'Bridged Points', points: bridgedPoints });

	if (!bridgedPoints) {
		// Return empty steps if bridgedPoints are null
		return steps;
	}

	// Connect bridged points
	const connectedPoints = connect(bridgedPoints[0], bridgedPoints[1], [...upper, ...lower]);
	steps.push({ type: 'Connected Points', points: connectedPoints });

	return steps;
}


// const points = [[0, 0], [5, 8], [13, 56], [27, 12], [42, 35], [56, 19], [68, 43], [75, 10], [89, 25], [97, 68], [110, 32], [125, 45], [135, 10], [145, 55], [150, 0], [160, 25], [170, 5], [180, 40], [190, 70], [200, 10]];
// const convexHullPoints = KPS(points);

// console.log(convexHullPoints);