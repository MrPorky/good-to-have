type Vector2 = {
  x: number;
  y: number;
};

/**
 * Calculate the value of a cubic bezier function at a given point in time.
 *
 * @param {number} t - The point in time to calculate the value for
 * @param {[number, number, number, number]} [p1, p2, p3, p4] - The control points of the cubic bezier curve
 * @return {number} The calculated value at the given point in time
 */
const cubicBezier = (
  t: number,
  [p1, p2, p3, p4]: [number, number, number, number]
) =>
  (1 - t) ** 3 * p1 +
  3 * (1 - t) ** 2 * t * p2 +
  3 * (1 - t) * t ** 2 * p3 +
  t ** 3 * p4;

/**
 * Returns a function that calculates the position along a bezier curve for a given t value.
 *
 * @param {Readonly<Vector2>} start - the starting point of the bezier curve
 * @param {Readonly<Vector2>} end - the ending point of the bezier curve
 * @param {Readonly<Vector2>} startTangent - the starting tangent of the bezier curve
 * @param {Readonly<Vector2>} endTangent - the ending tangent of the bezier curve
 * @return {(t: number) => Vector2} a function that takes a t value and returns the position along the bezier curve
 */
export const createBezierFunction = (
  start: Readonly<Vector2>,
  end: Readonly<Vector2>,
  startTangent: Readonly<Vector2> = start,
  endTangent: Readonly<Vector2> = end
): ((t: number) => Vector2) => {
  const [p1, p2, p3, p4] = [start, startTangent, endTangent, end];

  return (t: number): Vector2 => ({
    x: cubicBezier(t, [p1.x, p2.x, p3.x, p4.x]),
    y: cubicBezier(t, [p1.y, p2.y, p3.y, p4.y]),
  });
};
