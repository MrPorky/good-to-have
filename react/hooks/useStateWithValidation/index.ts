import { useState, useCallback } from "react"

type ValidationFunction<T> = (prev: T) => boolean
type NextState<T> = T | ((prev: T) => T)

export default <T>(validationFunc: ValidationFunction<T>, initialValue: T) => {
  const [state, setState] = useState(initialValue)
  const [isValid, setIsValid] = useState(() => validationFunc(state))

  const onChange = useCallback(
    (nextState: NextState<T>) => {
      const value = nextState instanceof Function ? nextState(state) : nextState
      setState(value)
      setIsValid(validationFunc(value))
    },
    [validationFunc]
  )

  return [state, onChange, isValid]
}