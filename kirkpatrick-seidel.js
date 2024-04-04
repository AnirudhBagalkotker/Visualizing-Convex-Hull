/**
 * Returns a new array of points with the x and y coordinates flipped.
 *
 * @param {Array<Array<number>>} points - The array of points to be flipped.
 * @return {Array<Array<number>>} - The new array of points with flipped coordinates.
 */
export function flipped(points) {
	return points.map(point => [-point[0], -point[1]]);
}

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
export function quickSelect(ls, index, lo = 0, hi = null, depth = 0) {
	if (hi === null) {
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
	points.sort((a, b) => a[0] - b[0]);
	if (!points || points.length === 0) return null; // No points to bridge
	if (points.length <= 2) {
		return points;
	}

	// Partition points into 2 sets based on the supporting line
	const L = points.filter(point => point[0] < verticalLine);
	const R = points.filter(point => point[0] > verticalLine);

	let candidates = new Set();

	let pairs = [];
	let oddPoint = null;
	for (let i = 0; i < points.length / 2; i++) pairs.push([points[i], points[points.length - 1 - i]]);
	// if (points.length % 2 != 0) pairs.push([points[points.length / 2], points[points.length / 2 ]]);
	if (points.length % 2 != 0) oddPoint = points[parseInt(points.length / 2)];

	// console.log(oddPoint);

	// console.log(pairs);

	let slopes = [];
	for (let i = 0; i < pairs.length; i++) {
		let [pi, pj] = pairs[i];
		if (pi === undefined || pj === undefined) {
			pairs.splice(i, 1);
			continue;
		}
		if (pi[0] === pj[0]) {
			pairs.splice(i, 1);
			candidates.add(pi[1] > pj[1] ? pi : pj);
		} else {
			slopes.push((pi[1] - pj[1]) / (pi[0] - pj[0]));
		}
	}

	if (slopes.length === 0) return null; // No valid slopes

	// console.log(`slopes: ${slopes}`);

	let medianIndex = Math.floor(slopes.length / 2) - (slopes.length % 2 === 0 ? 1 : 0);
	let medianSlope = quickSelect(slopes, medianIndex);


	// console.log(`slopes: ${slopes}`);
	// console.log(`medianSlope: ${medianSlope}`);

	let maxL, maxR, maxY = -Infinity;
	L.forEach(l => {
		let y_int = l[1] - medianSlope * l[0];
		if (maxY < y_int) {
			maxL = l;
			maxY = y_int;
		}
	})

	// console.log(`maxL: ${maxL}`);
	// console.log(`maxY: ${maxY}`);
	maxY = -Infinity;

	R.forEach(r => {
		let y_int = r[1] - medianSlope * r[0];
		if (maxY < y_int) {
			console.log(`y_int: ${y_int}`);
			maxR = r;
			maxY = y_int;
		}
	})

	// console.log(`maxR: ${maxR}`);
	// console.log(`maxY: ${maxY}`);

	const slopeLR = (maxR[1] - maxL[1]) / (maxR[0] - maxL[0]);
	const interceptLR = maxR[1] - slopeLR * maxR[0];
	let oddVal = null;
	if (oddPoint !== null) {
		oddVal = slopeLR * oddPoint[0] + interceptLR;
	}

	// console.log(`slopeLR: ${slopeLR}`);

	const small = new Set();
	const equal = new Set();
	const large = new Set();
	for (let i = 0; i < slopes.length; i++) {
		if (slopes[i] < medianSlope) small.add(pairs[i]);
		else if (slopes[i] === medianSlope) equal.add(pairs[i]);
		else large.add(pairs[i]);
	}

	// console.log(`slopeLR: ${slopeLR}`);
	// console.log(`medianSlope: ${medianSlope}`);

	if (slopeLR == medianSlope) {
		if (oddPoint !== null && oddPoint[1] < oddVal) {
			candidates.add(oddPoint);
		}
		else {
			return [maxL, maxR];
		}
	}
	else if (slopeLR < medianSlope) {
		for (const pair of [...large, ...equal]) {
			candidates.add(pair[0]);
			candidates.add(pair[1]);
		}
		for (const pair of small) {
			candidates.add(pair[1]);
		}
	}
	else if (slopeLR > medianSlope) {
		for (const pair of [...small, ...equal]) {
			candidates.add(pair[0]);
			candidates.add(pair[1]);
		}
		for (const pair of large) {
			candidates.add(pair[0]);
		}
	}

	// console.log(candidates);

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

	// Compute convex hull
	if (upper[upper.length - 1][0] === lower[0][0] && upper[upper.length - 1][1] === lower[0][1]) {
		upper.pop();
	}

	if (upper[0][0] === lower[lower.length - 1][0] && upper[0][1] === lower[lower.length - 1][1]) {
		lower.pop();
	}

	const convexHull = upper.concat(lower);
	steps.push({ type: 'Convex Hull', points: convexHull.slice() });

	return steps;
}


// const points = [[0, 0], [5, 8], [13, 56], [27, 12], [42, 35], [56, 19], [68, 43], [75, 10], [89, 25], [97, 68], [110, 32], [125, 45], [135, 10], [145, 55], [150, 0], [160, 25], [170, 5], [180, 40], [190, 70], [200, 10]];
// const convexHullPoints = KPS(points);

// console.log(convexHullPoints);