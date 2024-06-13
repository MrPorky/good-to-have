import { AnimateParams } from ".";

type TimingFunction = Required<AnimateParams>["timingFunction"];

/**
 * Returns a new easing function that is the inverse of the given `original` function.
 *
 * @param {TimingFunction} original - The original timing function.
 * @returns {TimingFunction} The new easing function.
 */
export const createEaseOut = (original: TimingFunction): TimingFunction => {
  return (timeFraction) => 1 - original(1 - timeFraction);
};

/**
 * Returns a new timing function that smoothly transitions from an ease-in to an ease-out animation.
 *
 * @param {TimingFunction} original - The original timing function.
 * @returns {TimingFunction} The new timing function.
 */
export const createEaseInOut = (original: TimingFunction): TimingFunction => {
  return (timeFraction) => {
    const half = timeFraction / 2;
    const easeIn = original(half);
    const easeOut = original(1 - half);
    return timeFraction < 1 ? easeIn / 2 : 1 - easeOut / 2;
  };
};
