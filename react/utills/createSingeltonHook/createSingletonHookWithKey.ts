import { useState, useEffect } from "react";

type UpdateValue<T> = T | ((prev: T) => T);
type CustomHook<HookValue, ReturnValue, CustomProps extends any[]> = (
  singletonValue: singletonValue<HookValue>,
  ...props: CustomProps
) => ReturnValue;
type singletonValue<HookValue> = {
  state: HookValue;
  updateState: (value: UpdateValue<HookValue>) => void;
};

const createSingletonHookWithKey = <
  HookValue,
  ReturnValue,
  CustomProps extends any[]
>(
  customHook: CustomHook<HookValue, ReturnValue, CustomProps>,
  initValue: HookValue
) => {
  let subscribers: Record<
    string,
    React.Dispatch<React.SetStateAction<HookValue>>[]
  > = {};
  let singletonValue: Record<string, HookValue> = {};
  let hookValue: Record<string, ReturnValue>;
  let mounted: Record<string, Boolean> = {};

  const updateSingletonValue = (
    key: string,
    updateValue: UpdateValue<HookValue>
  ) => {
    singletonValue[key] =
      updateValue instanceof Function
        ? updateValue(singletonValue[key])
        : updateValue;
    subscribers[key].forEach((cb) => cb(() => singletonValue[key]));
  };

  const useSingletonHook = (key: string, ...props: CustomProps) => {
    if (mounted[key] === undefined) {
      singletonValue[key] = initValue;
    }

    const [state, updateState] = useState(singletonValue[key]);
    const val = customHook(
      {
        state,
        updateState: (updateValue: UpdateValue<HookValue>) =>
          updateSingletonValue(key, updateValue),
      },
      ...props
    );
    hookValue[key] = val;
    mounted[key] = true;

    useEffect(() => {
      updateState(singletonValue[key]);

      if (!Array.isArray(subscribers[key])) subscribers[key] = [];

      subscribers[key].push(updateState);

      return () => {
        subscribers[key] = subscribers[key].filter((el) => el !== updateState);
      };
    }, [key]);

    return val;
  };

  return {
    useHook: useSingletonHook,
    updateHook: updateSingletonValue,
    getValue: (key: string) => hookValue[key],
  };
};

export { createSingletonHookWithKey };
export const createSingletonStateWithKey = <T>(initValue: T) =>
  createSingletonHookWithKey(({ state }) => state, initValue);
