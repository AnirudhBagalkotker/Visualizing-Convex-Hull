import random
from random import uniform
import matplotlib.pyplot as plt


def flipped(points):
    return [[-point[0], -point[1]] for point in points]


def quickSelect(ls, index, lo=0, hi=None, depth=0):
    if hi is None:
        hi = len(ls) - 1
    if lo == hi:
        return ls[lo]
    pivot = random.randint(lo, hi)
    ls[lo], ls[pivot] = ls[pivot], ls[lo]
    cur = lo
    for run in range(lo + 1, hi + 1):
        if ls[run] < ls[lo]:
            cur += 1
            ls[cur], ls[run] = ls[run], ls[cur]
    ls[cur], ls[lo] = ls[lo], ls[cur]
    if index < cur:
        return quickSelect(ls, index, lo, cur - 1, depth + 1)
    elif index > cur:
        return quickSelect(ls, index, cur + 1, hi, depth + 1)
    else:
        return ls[cur]


def bridge(points, vertical_line):
    if not points:
        return None  # No points to bridge

    candidates = set()
    if len(points) == 2:
        return tuple(sorted(points))
    pairs = []
    modify_s = set(map(tuple, points))
    while len(modify_s) >= 2:
        pairs += [tuple(sorted([modify_s.pop(), modify_s.pop()]))]
    if len(modify_s) == 1:
        candidates.add(modify_s.pop())
    slopes = []
    for pi, pj in pairs[:]:
        if pi[0] == pj[0]:
            pairs.remove((pi, pj))
            candidates.add(pi if pi[1] > pj[1] else pj)
        else:
            slopes += [(pi[1] - pj[1]) / (pi[0] - pj[0])]
    if not slopes:
        return None  # No valid slopes
    median_index = len(slopes) // 2 - (1 if len(slopes) % 2 == 0 else 0)
    median_slope = quickSelect(slopes, median_index)
    small = {pairs[i] for i, slope in enumerate(slopes) if slope < median_slope}
    equal = {pairs[i] for i, slope in enumerate(slopes) if slope == median_slope}
    large = {pairs[i] for i, slope in enumerate(slopes) if slope > median_slope}
    max_slope = max(point[1] - median_slope * point[0] for point in points)
    max_set = [
        point for point in points if point[1] - median_slope * point[0] == max_slope
    ]
    left = min(max_set)
    right = max(max_set)
    if left[0] <= vertical_line and right[0] > vertical_line:
        return (left, right)
    if right[0] <= vertical_line:
        candidates |= {point for _, point in large | equal}
        candidates |= {point for pair in small for point in pair}
    if left[0] > vertical_line:
        candidates |= {point for point, _ in small | equal}
        candidates |= {point for pair in large for point in pair}
    return bridge(candidates, vertical_line)


def upper_hull(points):
    points = sorted(points)  # Sort points based on x-coordinate
    upper = []
    for p in points:
        while (
            len(upper) >= 2
            and (p[0] - upper[-2][0]) * (upper[-1][1] - upper[-2][1])
            - (p[1] - upper[-2][1]) * (upper[-1][0] - upper[-2][0])
            >= 0
        ):
            upper.pop()
        upper.append(p)
    return upper


def connect(lower, upper, points):
    if lower == upper:
        return [lower]
    points = [p for p in points if p[0] < lower[0] or p[0] > upper[0]]
    if not points:
        return [lower, upper]
    max_left = max(
        points, key=lambda p: (p[0], -p[1])
    )  # Find the point with maximum x-coordinate and minimum y-coordinate
    min_right = min(
        points, key=lambda p: (p[0], -p[1])
    )  # Find the point with minimum x-coordinate and minimum y-coordinate
    bridge_result = bridge(points, (max_left[0] + min_right[0]) / 2)
    if bridge_result is None:
        return [lower, upper]
    left, right = bridge_result
    points_left = [p for p in points if p[0] < left[0]]
    points_right = [p for p in points if p[0] > right[0]]
    return connect(lower, left, points_left) + connect(right, upper, points_right)


def convex_hull(points):
    upper = upper_hull(points)
    lower = flipped(upper_hull(flipped(points)))
    if upper[-1] == lower[0]:
        del upper[-1]
    if upper[0] == lower[-1]:
        del lower[-1]
    return upper + lower


# sample = 50
# radius = 20
# points = [[random.uniform(-radius, radius), random.uniform(-radius, radius)] for _ in range(sample)]
# points = [p for p in points if p[0]**2 + p[1]**2 <= radius**2]

points = [
    [0, 0],
    [5, 8],
    [13, 56],
    [27, 12],
    [42, 35],
    [56, 19],
    [68, 43],
    [75, 10],
    [89, 25],
    [97, 68],
    [110, 32],
    [125, 45],
    [135, 10],
    [145, 55],
    [150, 0],
    [160, 25],
    [170, 5],
    [180, 40],
    [190, 70],
    [200, 10],
]

answer = convex_hull(points)
print(answer)
