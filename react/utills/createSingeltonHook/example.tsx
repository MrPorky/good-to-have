import React from "react";
import { createSingletonState } from "./createSingletonHook";

// Create a singleton hook for managing a count state
const {
  useHook: useCount,
  updateHook: updateCount,
  getValue: getCount,
} = createSingletonState(0);

/**
 * Component1: Renders the shared count state.
 * All instances of this component share the same state.
 * @returns {JSX.Element} A paragraph displaying the count.
 */
const Component1 = (): JSX.Element => {
  const count = useCount();

  return <p>{count}</p>;
};

/**
 * Component2: Increments the count state.
 * This updates the state for all components using the count hook.
 * @returns {JSX.Element} A button to increase the count.
 */
const Component2 = (): JSX.Element => {
  const count = useCount();

  const handleClick = () => updateCount((value) => value + 1);

  return <button onClick={handleClick}>Increes count {count}</button>;
};

/**
 * Component3: Increments the count using the update function.
 * This component does not react to changes in the update itself.
 * @returns {JSX.Element} A button to increase the count.
 */
const Component3 = (): JSX.Element => {
  const handleClick = () => updateCount((value) => value + 1);

  return <button onClick={handleClick}>Increes count</button>;
};

/**
 * doSomeStuff: Performs an operation using the current count value.
 * This function is not subscribed to count changes but can still access the current value.
 * @returns {number} The double of the current count.
 */
const doSomeStuff = (): number => getCount() * 2;
