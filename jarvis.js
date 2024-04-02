const startTime=process.hrtime()
function leftmostPoint(points) {
    var sorted_points = points.sort(function(a, b) {
        return a[0] - b[0] || a[1] - b[1];
    });
    var leftmostPoint = sorted_points[0];
    return leftmostPoint;
}

function crossProduct(origin, p1, p2) {
    return (p1[0] - origin[0]) * (p2[1] - origin[1]) - (p1[1] - origin[1]) * (p2[0] - origin[0]);
}

function checkCollinearity(points){
    for (let i = 1; i < points.length-1; i++) {
        if(crossProduct(points[0],points[i],points[i+1])){
            return false;
        }
    }
    return true;
}


function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function findnextVertex(points, currentVertex) {
    var nextVertex = points[0];
    for (var i = 1; i < points.length; i++) {
        var p = points[i];
        if (p[0] === currentVertex[0] && p[1] === currentVertex[1]) {
            continue;
        }
        var cp = crossProduct(currentVertex, nextVertex, p);
        if (cp > 0 || nextVertex[0] === currentVertex[0] && nextVertex[1] === currentVertex[1] || (cp === 0 && distance(currentVertex, p) > distance(currentVertex, nextVertex))) {
            nextVertex = p;
        }
    }
    return nextVertex;
}

function jarvisMarch(points) {
    if (points.length < 3 || checkCollinearity(points)) {
        return [];
    }
    var hull = [];
    var startPoint = leftmostPoint(points);
    var startVertex = startPoint;
    var currentVertex = startVertex;
    while (true) {
        hull.push(currentVertex);
        var nextVertex = findnextVertex(points, currentVertex);
        if (nextVertex[0] === startVertex[0] && nextVertex[1] === startVertex[1]) {
            break;
        } else {
            currentVertex = nextVertex;
        }
    }
    return hull;
}
function generateRandomPoints(numPoints, range) {
    var points = [];
    for (var i = 0; i < numPoints; i++) {
        var x = Math.floor(Math.random() * (range * 2)) - range;
        var y = Math.floor(Math.random() * (range * 2)) - range;
        points.push([x, y]);
    }
    return points;
}

var numPoints = Math.floor(Math.random() * 100); 
var range = 10;
var points = generateRandomPoints(numPoints, range);
var convexHull = jarvisMarch(points);
var h=convexHull.length
const endTime=process.hrtime(startTime)
const mem=process.memoryUsage().heapUsed/1024;
console.log(`Time taken: ${endTime[0] * 1000 + endTime[1] / 1000000} milliseconds`);
console.log(`The script uses approximately ${Math.round(mem * 100) / 100} KB`);
console.log(numPoints)
console.log(h)
console.log(points)
console.log(convexHull);

