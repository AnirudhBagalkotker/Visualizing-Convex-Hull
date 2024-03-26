/**
 * Returns the leftmost point from an array of points.
 *
 * @param {Array<Array<number>>} points - The array of points to search from.
 * @return {Array<number>} The leftmost point from the array.
 */
export function leftmostPoint(points) {
    let sorted_points = points.sort(function (a, b) {
        return a[0] - b[0] || a[1] - b[1];
    });
    let leftmostPoint = sorted_points[0];
    return leftmostPoint;
}

/**
 * Calculate the cross product of two vectors.
 *
 * @param {Array} origin - The origin point of the vectors
 * @param {Array} p1 - The first vector
 * @param {Array} p2 - The second vector
 * @return {number} The cross product of the two vectors
 */
export function crossProduct(origin, p1, p2) {
    return (p1[0] - origin[0]) * (p2[1] - origin[1]) - (p1[1] - origin[1]) * (p2[0] - origin[0]);
}

/**
 * Calculates the Euclidean distance between two points in a 2D space.
 *
 * @param {Array} p1 - The coordinates of the first point [x, y]
 * @param {Array} p2 - The coordinates of the second point [x, y]
 * @return {number} The distance between the two points
 */
export function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

/**
 * Finds the next vertex in a given set of points based on the current vertex.
 *
 * @param {Array<Array<number>>} points - The array of points representing the vertices.
 * @param {Array<number>} currentVertex - The current vertex.
 * @return {Array<number>} The next vertex.
 */
export function findNextVertex(points, currentVertex) {
    let nextVertex = points[0];
    for (let i = 1; i < points.length; i++) {
        let p = points[i];
        if (p[0] === currentVertex[0] && p[1] === currentVertex[1]) continue;
        let cp = crossProduct(currentVertex, nextVertex, p);
        if (cp > 0 || nextVertex[0] === currentVertex[0] && nextVertex[1] === currentVertex[1] || (cp === 0 && distance(currentVertex, p) > distance(currentVertex, nextVertex))) nextVertex = p;
    }
    return nextVertex;
}

/**
 * Performs the Jarvis March algorithm to find the convex hull of a set of points.
 *
 * @param {Array} points - The array of points to compute the convex hull for.
 * @return {Array} The array representing the points on the convex hull.
 */
export function jarvisMarch(points) {
    if (points.length < 3) return points;
    let hull = [], startPoint = leftmostPoint(points), startVertex = startPoint, currentVertex = startVertex;
    while (true) {
        hull.push(currentVertex);
        let nextVertex = findNextVertex(points, currentVertex);
        if (nextVertex[0] === startVertex[0] && nextVertex[1] === startVertex[1]) break;
        else currentVertex = nextVertex;
    }
    return hull;
}

// Testing Jarvis-March algorithm

// let points = [[0, 0], [5, 8], [13, 56], [27, 12], [42, 35], [56, 19], [68, 43], [75, 10], [89, 25], [97, 68], [110, 32], [125, 45], [135, 10], [145, 55], [150, 0], [160, 25], [170, 5], [180, 40], [190, 70], [200, 10]];
// let convexHull = jarvisMarch(points);
// console.log(convexHull);

// Test Successful