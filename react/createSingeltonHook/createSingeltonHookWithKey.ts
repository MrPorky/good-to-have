import { useState, useEffect } from 'react'

type singeltonValue<HookValue> = {
  state: HookValue,
  updateState: (value: updateValue<HookValue>) => void
};

type updateValue<T> = T extends any ? (T | ((prev: T) => T)) : never

type customHook<HookValue, ReturnValue, CustomProps extends any[]> = (singeltonValue: singeltonValue<HookValue>, ...props: CustomProps) => ReturnValue;

export const createSingeltonHookWithKey = <HookValue, ReturnValue, CustomProps extends any[]>(customHook: customHook<HookValue, ReturnValue, CustomProps>, initValue: HookValue) => {
  let updaters: Record<string, React.Dispatch<React.SetStateAction<HookValue>>[]> = {};
  let singeltonValue: Record<string, HookValue> = {};
  let hookValue: Record<string, ReturnValue>;
  let mounted: Record<string, Boolean> = {};

  const updateSingeltonValue = (key: string, updateValue: updateValue<HookValue>) => {
    singeltonValue[key] = typeof updateValue === "function" ? updateValue(singeltonValue[key]) : updateValue
    updaters[key].forEach(cb => cb(() => singeltonValue[key]))
  }

  const useSingeltonHook = (key: string, ...props: CustomProps) => {
    if (mounted[key] === undefined) {
      singeltonValue[key] = initValue;
    }

    const [state, updateState] = useState(singeltonValue[key]);
    const val = customHook({ state, updateState: (updateValue: updateValue<HookValue>) => updateSingeltonValue(key, updateValue) }, ...props)
    hookValue[key] = val;
    mounted[key] = true;

    useEffect(() => {
      updateState(singeltonValue[key]);

      if (!Array.isArray(updaters[key])) updaters[key] = []

      updaters[key].push(updateState);

      return () => { updaters[key] = updaters[key].filter(el => el !== updateState) };
    }, [key])

    return val;
  }

  return {
    useHook: useSingeltonHook,
    updateHook: updateSingeltonValue,
    getValue: (key: string) => hookValue[key]
  }
}