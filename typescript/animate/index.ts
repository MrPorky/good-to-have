export type AnimateParams = {
  /**
   * A function that takes a time fraction [0, 1] and returns a progress value [0, 1]
   */
  timingFunction?: (t: number) => number;

  /**
   * A function that takes a progress value [0, 1] and draws the corresponding animation
   */
  draw: (progress: number) => void;

  /**
   * The duration of the animation in milliseconds
   */
  duration: number;
};

/**
 * Animates the given parameters over a specified duration using the provided timing function and draw callback.
 *
 * @param {AnimateParams} params - Animation parameters object
 * @return {Function} A function to stop the animation
 */
export const animate = ({ timingFunction, draw, duration }: AnimateParams) => {
  const startTime = performance.now();
  let isAnimationStopped = false;

  const stopAnimation = () => (isAnimationStopped = true);

  const step = (currentTime: number) => {
    if (isAnimationStopped) return;

    const elapsedTime = currentTime - startTime;
    const timeFraction = Math.min(elapsedTime / Math.max(1, duration), 1);
    const progress = timingFunction?.(timeFraction) ?? timeFraction;

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);

  return stopAnimation;
};
