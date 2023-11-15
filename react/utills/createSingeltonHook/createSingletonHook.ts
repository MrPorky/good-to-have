import { useState, useEffect } from "react";

type UpdateValue<T> = T | ((prev: T) => T);
type CustomHook<HookValue, ReturnValue, CustomProps extends any[]> = (
  singletonValue: SingletonValue<HookValue>,
  ...props: CustomProps
) => ReturnValue;
type SingletonValue<HookValue> = {
  state: HookValue;
  updateState: (value: UpdateValue<HookValue>) => void;
};

const createSingletonHook = <HookValue, ReturnValue, CustomProps extends any[]>(
  customHook: CustomHook<HookValue, ReturnValue, CustomProps>,
  initValue: HookValue
) => {
  let subscribers: React.Dispatch<React.SetStateAction<HookValue>>[] = [];
  let singletonValue = initValue;
  let hookValue: ReturnValue;
  let mounted = false;

  const updateSingletonValue = (updateValue: UpdateValue<HookValue>) => {
    singletonValue =
      updateValue instanceof Function
        ? updateValue(singletonValue)
        : updateValue;
    subscribers.forEach((cb) => cb(() => singletonValue));
  };

  const useSingletonHook = (...props: CustomProps): ReturnValue => {
    const [state, updateState] = useState(singletonValue);
    const val = customHook(
      { state, updateState: updateSingletonValue },
      ...props
    );
    hookValue = val;
    mounted = true;

    useEffect(() => {
      updateState(singletonValue);
      subscribers.push(updateState);

      return () => {
        subscribers = subscribers.filter((el) => el !== updateState);
      };
    }, []);

    return val;
  };

  return {
    useHook: useSingletonHook,
    updateHook: updateSingletonValue,
    getValue: () => hookValue,
  };
};

export { createSingletonHook };
export const createSingletonState = <T>(initValue: T) =>
  createSingletonHook(({ state }) => state, initValue);
