import { describe, expect, it } from "vitest";
import {
  createSingletonState,
  createSingletonHook,
} from "./createSingletonHook";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

describe("createSingletonHook", () => {
  it("createSingletonState", () => {
    const {
      useHook: useCount,
      updateHook: updateCount,
      getValue: getCount,
    } = createSingletonState(0);

    const Component1 = (): JSX.Element => {
      const count = useCount();

      return <p>{count}</p>;
    };

    const Component2 = (): JSX.Element => {
      const handleClick = () => updateCount((value) => value + 1);

      return <button onClick={handleClick}>Increes count</button>;
    };

    render(
      <>
        <Component1 />
        <Component1 />
        <Component2 />
      </>
    );

    let values = screen.getAllByText(0);
    expect(getCount()).toBe(0);
    expect(values.length).toBe(2);

    const button = screen.getByRole("button");
    expect(button).toBeDefined();

    fireEvent.click(button);

    values = screen.getAllByText(1);
    expect(getCount()).toBe(1);
    expect(values.length).toBe(2);
  });

  it("createSingletonHook", () => {
    const {
      useHook: useCount,
      updateHook: updateCount,
      getValue: getCount,
    } = createSingletonHook(({ state }) => state * 2, 1 as number);

    const Component1 = (): JSX.Element => {
      const count = useCount();

      return <p>{count}</p>;
    };

    const Component2 = (): JSX.Element => {
      const handleClick = () => updateCount((value) => value + 1);

      return <button onClick={handleClick}>Increes count</button>;
    };

    render(
      <>
        <Component1 />
        <Component1 />
        <Component2 />
      </>
    );

    let values = screen.getAllByText(2);
    expect(getCount()).toBe(2);
    expect(values.length).toBe(2);

    const button = screen.getByRole("button");
    expect(button).toBeDefined();

    fireEvent.click(button);

    values = screen.getAllByText(4);
    expect(getCount()).toBe(4);
    expect(values.length).toBe(2);
  });
});
