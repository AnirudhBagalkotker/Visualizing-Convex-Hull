# Jarvis March

## Overview

Jarvis March, also known as the gift-wrapping algorithm, is a method used in computational geometry to find the convex hull of a set of points. A convex hull is formed by stretching a rubber band around the outermost points in a set.

Here's how the Jarvis March algorithm works:

1. Finding the leftmost point: This is guaranteed to be part of the convex hull.
2. Selecting the next point: Look at all the remaining points and determine which one is the most counterclockwise relative to the current point. If there are ties, it means that if multiple points lie on the same line, choose the farthest one. This ensures the hull is as wide as possible.
3. Repeating: This process should be continued, moving to the most counterclockwise point each time till you loop back to the starting point.
4. Completion: Once you return to the initial point, the set of points you've accumulated forms the convex hull.

## Implementation

1. **Finding the leftmost point**
   In case there are two vectors(directed towards the point away from the origin) whose counterclockwise orientation is
   the same meaning that both the points lie on the same line then the point whose distance is more from the origin will
   be chosen.

   ```javascript
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
   ```

2. **Calculating the cross product of two lines**
   This function will be used to determine which line is the most counterclockwise. The more negative the cross product the more it is tilted in the counterclockwise direction.

   ```javascript
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
   ```

3. **Distance between two points**
   In case there are two vectors(directed towards the point away from the origin) whose counterclockwise orientation is
   the same meaning that both the points lie on the same line then the point whose distance is more from the origin will be chosen.

   ```javascript
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
   ```

4. **Finding the next vertex**
   This function finds the next vertex that should be part of the convex hull.
   The function initialises the start vertex as the leftmost point. Then the next
   vertex is decided on the basis of the cross product and in case both lie in the same direction
   then distance is used as a tie breaker.

   ```javascript
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
   ```

5. **Performing the Jarvis march**
   If number of points are less than 3 then no convex hull is possible

   ```javascript
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
   ```

## Analysis

### Time taken for n,h

| Time(in ms) | n  | h  |
| ----------- | -- | -- |
| 0.6441      | 74 | 8  |
| 0.0732      | 1  | 1  |
| 0.1781      | 5  | 5  |
| 0.1781      | 56 | 6  |
| 0.389       | 63 | 9  |
| 0.8022      | 37 | 12 |
| 0.3288      | 23 | 8  |
| 0.6742      | 71 | 9  |
