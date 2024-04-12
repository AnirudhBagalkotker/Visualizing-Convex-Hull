function compareX(a, b) {
	return a[0] - b[0];
}

function partition(nums, left, right, pivotIndex) {
	let pivotValue = nums[pivotIndex];
	[nums[pivotIndex], nums[right]] = [nums[right], nums[pivotIndex]]; // Move pivot to end
	let storeIndex = left;
	for (let i = left; i < right; i++) {
		if (nums[i] < pivotValue) {
			[nums[i], nums[storeIndex]] = [nums[storeIndex], nums[i]];
			storeIndex++;
		}
	}
	[nums[storeIndex], nums[right]] = [nums[right], nums[storeIndex]]; // Move pivot to its final place
	return storeIndex;
}

function quickselect(nums, left, right, k) {
	if (left >= right) {
		return nums[left];
	}

	let pivotIndex = left + ((right - left) >> 1);
	pivotIndex = partition(nums, left, right, pivotIndex);

	if (k === pivotIndex) {
		return nums[k];
	} else if (k < pivotIndex) {
		return quickselect(nums, left, pivotIndex - 1, k);
	} else {
		return quickselect(nums, pivotIndex + 1, right, k);
	}
}

function findMedian(nums) {
	if (nums.length === 0) {
		throw new Error("Cannot find median of an empty array.");
	}

	let n = nums.length;
	let mid = n / 2;
	let median = quickselect(nums, 0, n - 1, mid);

	// If the size is even, we need to find the average of the two middle numbers
	if (n % 2 === 0) {
		let lowerMedian = quickselect(nums, 0, mid - 1, mid - 1);
		median = (median + lowerMedian) / 2.0;
	}

	return median;
}

function findMinMaxX(points) {
	let res = [];
	let minIndex = 0,
		maxIndex = 0;
	let puminx = points[0][0];
	let puminy = points[0][1];
	let pumaxx = points[0][0];
	let pumaxy = points[0][1];

	for (let i = 1; i < points.length; i++) {
		if (
			points[i][0] < puminx ||
			(points[i][0] === puminx && points[i][1] > puminy)
		) {
			puminx = points[i][0];
			puminy = points[i][1];
			minIndex = i;
		}
		if (
			points[i][0] > pumaxx ||
			(points[i][0] === pumaxx && points[i][1] > pumaxy)
		) {
			pumaxx = points[i][0];
			pumaxy = points[i][1];
			maxIndex = i;
		}
	}
	res.push([puminx, puminy]);
	res.push([pumaxx, pumaxy]);
	let indices = [minIndex, maxIndex];
	return [res, indices];
}

function UpperBridge(points, a) {
	let candidates = [];
	let n = points.length;
	if (points.length === 2) {
		if (points[0][0] < points[1][0]) return [points[0], points[1]];
		else return [points[1], points[0]];
	}
	let pairs = [];
	let K = [];
	let i = 0;
	if (points.length % 2 === 1) {
		candidates.push(points[0]);
		i++;
	}
	for (; i <= n - 2; i += 2) {
		let x1 = points[i][0];
		let x2 = points[i + 1][0];

		if (x1 <= x2) {
			pairs.push([points[i], points[i + 1]]);
		} else {
			pairs.push([points[i + 1], points[i]]);
		}
	}

	for (i = 0; i < pairs.length; i++) {
		let p1 = pairs[i][0];
		let p2 = pairs[i][1];

		if (p1[0] === p2[0]) {
			if (p1[1] > p2[1]) {
				candidates.push(p1);
			} else {
				candidates.push(p2);
			}
		} else {
			K.push((p1[1] - p2[1]) / (p1[0] - p2[0]));
		}
	}

	let medianK = findMedian(K);

	let smaller = [],
		equal = [],
		larger = [];

	for (i = 0; i < pairs.length; i++) {
		let p1 = pairs[i][0];
		let p2 = pairs[i][1];

		let slopeVal = (p1[1] - p2[1]) / (p1[0] - p2[0]);
		if (slopeVal < medianK) {
			smaller.push([p1, p2]);
		} else if (slopeVal === medianK) {
			equal.push([p1, p2]);
		} else {
			larger.push([p1, p2]);
		}
	}

	let maximumIntercept = -Infinity;

	for (let point of points) {
		let y = point[1];
		let x = point[0];

		if (maximumIntercept < y - medianK * x) {
			maximumIntercept = y - medianK * x;
		}
	}

	let pk = [Infinity, Infinity];
	let pm = [-Infinity, -Infinity];

	for (let point of points) {
		let y = point[1];
		let x = point[0];

		if (y - medianK * x === maximumIntercept) {
			if (x < pk[0]) {
				pk = [x, y];
			}
			if (x > pm[0]) {
				pm = [x, y];
			}
		}
	}

	if (pk[0] <= a && pm[0] > a) {
		return [pk, pm];
	}

	if (pm[0] <= a) {
		for (let pair of larger) {
			candidates.push(pair[1]);
		}
		for (let pair of equal) {
			candidates.push(pair[1]);
		}
		for (let pair of smaller) {
			candidates.push(pair[1]);
			candidates.push(pair[0]);
		}
	}

	if (pk[0] > a) {
		for (let pair of larger) {
			candidates.push(pair[1]);
			candidates.push(pair[0]);
		}
		for (let pair of equal) {
			candidates.push(pair[0]);
		}
		for (let pair of smaller) {
			candidates.push(pair[0]);
		}
	}

	return UpperBridge(candidates, a);
}

function partition_pair(S, left, right) {
	let pivotValue = S[right];
	let storeIndex = left;

	for (let i = left; i < right; i++) {
		if (S[i][0] < pivotValue[0]) {
			[S[i], S[storeIndex]] = [S[storeIndex], S[i]];
			storeIndex++;
		}
	}

	[S[storeIndex], S[right]] = [S[right], S[storeIndex]];
	return storeIndex;
}

function quickSelect_pair(S, left, right, k) {
	if (left === right) return S[left];

	let pivotIndex = partition_pair(S, left, right);

	if (k === pivotIndex) return S[k];
	else if (k < pivotIndex)
		return quickSelect_pair(S, left, pivotIndex - 1, k);
	else return quickSelect_pair(S, pivotIndex + 1, right, k);
}

function connect_U(pk, pm, S, edges) {
	let medianX;
	let n = S.length;

	let medianPoint = quickSelect_pair(S, 0, n - 1, Math.floor(n / 2)); // Find the median point

	medianX = medianPoint[0];

	console.log("Median line: x = " + medianX);

	let ub = UpperBridge(S, medianX);

	let pi = ub[0];
	let pj = ub[1];

	edges.push(ub);

	let S_left = [],
		S_right = [];

	S_left.push(pi);
	S_right.push(pj);

	for (let point of S) {
		if (point[0] < pi[0]) {
			S_left.push(point);
		}
		if (point[0] > pj[0]) {
			S_right.push(point);
		}
	}

	if (pi[0] !== pk[0] || pi[1] !== pk[1]) {
		connect_U(pk, pi, S_left, edges);
	}
	if (pj[0] !== pm[0] || pj[1] !== pm[1]) {
		connect_U(pj, pm, S_right, edges);
	}
}

function UpperHull(points, edges) {
	let n = points.length;
	if (n === 2) {
		edges.push([points[0], points[1]]);
		return;
	}

	let temp = findMinMaxX(points);

	let pmin = temp[0][0];
	let pmax = temp[0][1];

	let minIndex = temp[1][0];
	let maxIndex = temp[1][1];

	if (minIndex === maxIndex) {
		return;
	}

	let uhPoints = [];

	uhPoints.push(pmin);
	uhPoints.push(pmax);
	for (let point of points) {
		if (point[0] > pmin[0] && point[0] < pmax[0]) {
			uhPoints.push(point);
		}
	}

	let medianPoint = quickSelect_pair(
		uhPoints,
		0,
		uhPoints.length - 1,
		Math.floor(uhPoints.length / 2)
	);
	let medianX = medianPoint[0];

	let uhPointsSorted = [...uhPoints];

	connect_U(pmin, pmax, uhPointsSorted, edges);
}

function connect_L(pk, pm, S, edges) {
	let medianX;
	let n = S.length;

	let medianPoint = quickSelect_pair(S, 0, n - 1, Math.floor(n / 2)); // Find the median point

	medianX = medianPoint[0];

	console.log("Median line: x = " + medianX);

	let ub = UpperBridge(S, medianX);

	let pi = ub[0];
	let pj = ub[1];

	edges.push([
		[-ub[0][0], -ub[0][1]],
		[-ub[1][0], -ub[1][1]],
	]);

	let S_left = [],
		S_right = [];

	S_left.push(pi);
	S_right.push(pj);

	for (let point of S) {
		if (point[0] < pi[0]) {
			S_left.push(point);
		}
		if (point[0] > pj[0]) {
			S_right.push(point);
		}
	}

	if (pi[0] !== pk[0] || pi[1] !== pk[1]) {
		connect_L(pk, pi, S_left, edges);
	}
	if (pj[0] !== pm[0] || pj[1] !== pm[1]) {
		connect_L(pj, pm, S_right, edges);
	}
}

function LowerHull(points, edges) {
	let n = points.length;
	if (n === 2) {
		edges.push([points[0], points[1]]);
		return;
	}

	points.sort(compareX);

	let temp = findMinMaxX(points);

	let pmin = temp[0][0];
	let pmax = temp[0][1];

	let minIndex = temp[1][0];
	let maxIndex = temp[1][1];

	if (minIndex === maxIndex) {
		return;
	}

	let uhPoints = [];

	uhPoints.push(pmin);
	uhPoints.push(pmax);
	for (let point of points) {
		if (point[0] > pmin[0] && point[0] < pmax[0]) {
			uhPoints.push(point);
		}
	}

	let medianPoint = quickSelect_pair(
		uhPoints,
		0,
		uhPoints.length - 1,
		Math.floor(uhPoints.length / 2)
	);
	let medianX = medianPoint[0];

	let uhPointsSorted = [...uhPoints];

	connect_L(pmin, pmax, uhPointsSorted, edges);
}