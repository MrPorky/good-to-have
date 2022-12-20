import { useState, useEffect } from 'react'

type singeltonValue<HookValue> = {
  state: HookValue,
  updateState: (value: updateValue<HookValue>) => void
};

type updateValue<T> = T extends any ? (T | ((prev: T) => T)) : never

type customHook<HookValue, ReturnValue, CustomProps extends any[]> = (singeltonValue: singeltonValue<HookValue>, ...props: CustomProps) => ReturnValue;

export default <HookValue, ReturnValue, CustomProps extends any[]>(customHook: customHook<HookValue, ReturnValue, CustomProps>, initValue: HookValue) => {
  let updaters: React.Dispatch<React.SetStateAction<HookValue>>[] = [];
  let singeltonValue = initValue;
  let hookValue: ReturnValue;
  let mounted = false;

  const updateSingeltonValue = (updateValue: updateValue<HookValue>) => {
    singeltonValue = typeof updateValue === "function" ? updateValue(singeltonValue) : updateValue
    updaters.forEach(cb => cb(() => singeltonValue))
  }

  const useSingeltonHook = (...props: CustomProps) => {
    const [state, updateState] = useState(singeltonValue);
    const val = customHook({ state, updateState: updateSingeltonValue }, ...props)
    hookValue = val;
    mounted = true;

    useEffect(() => {
      updateState(singeltonValue);
      updaters.push(updateState);

      return () => { updaters = updaters.filter(el => el !== updateState) };
    }, [])

    return val;
  }

  return {
    useHook: useSingeltonHook,
    updateHook: updateSingeltonValue,
    getValue: () => hookValue
  }
}
