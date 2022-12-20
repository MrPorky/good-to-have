import { useState, useEffect } from 'react'

type UpdateValue<T> = T | ((prev: T) => T)
type CustomHook<HookValue, ReturnValue, CustomProps extends any[]> = (singeltonValue: SingeltonValue<HookValue>, ...props: CustomProps) => ReturnValue;
type SingeltonValue<HookValue> = {
  state: HookValue,
  updateState: (value: UpdateValue<HookValue>) => void
};

export default <HookValue, ReturnValue, CustomProps extends any[]>(customHook: CustomHook<HookValue, ReturnValue, CustomProps>, initValue: HookValue) => {
  let updaters: React.Dispatch<React.SetStateAction<HookValue>>[] = [];
  let singeltonValue = initValue;
  let hookValue: ReturnValue;
  let mounted = false;

  const updateSingeltonValue = (updateValue: UpdateValue<HookValue>) => {
    singeltonValue = updateValue instanceof Function ? updateValue(singeltonValue) : updateValue
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
