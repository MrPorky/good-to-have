import { describe, expect, it } from "vitest";
import { createBezierFunction } from "./index";

describe("createBezierFunction", () => {
  it("calculates position along bezier curve correctly for t = 0", () => {
    const start = { x: 0, y: 0 };
    const end = { x: 100, y: 100 };
    const startTangent = { x: 20, y: 30 };
    const endTangent = { x: 80, y: 70 };

    const bezierFunction = createBezierFunction(
      start,
      end,
      startTangent,
      endTangent
    );
    const result = bezierFunction(0);

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("calculates position along bezier curve correctly for t = 1", () => {
    const start = { x: 0, y: 0 };
    const end = { x: 100, y: 100 };
    const startTangent = { x: 20, y: 30 };
    const endTangent = { x: 80, y: 70 };

    const bezierFunction = createBezierFunction(
      start,
      end,
      startTangent,
      endTangent
    );
    const result = bezierFunction(1);

    expect(result).toEqual({ x: 100, y: 100 });
  });

  it("calculates position along bezier curve correctly for t = 0.5", () => {
    const start = { x: 0, y: 0 };
    const end = { x: 100, y: 100 };
    const startTangent = { x: 20, y: 30 };
    const endTangent = { x: 80, y: 70 };

    const bezierFunction = createBezierFunction(
      start,
      end,
      startTangent,
      endTangent
    );
    const result = bezierFunction(0.5);

    expect(result).toEqual({ x: 50, y: 50 });
  });
});
