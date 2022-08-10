import { useEffect, useRef } from 'react';

const map = new Map();
export default (id, key, callback) => {
  const hookIdRef = useRef(new Date().getTime());
  const observableObjectRef = useRef(
    (() => {
      if (!map.has(id)) {
        map.set(id, {
          observers: new Map(),
          obj: new Proxy(
            {},
            {
              set(target, p, value, receiver) {
                const observers = map.get(id).observers.get(p);
                observers.forEach((cb) => cb && cb(value));
                return Reflect.set(target, p, value, receiver);
              },
            },
          ),
        });
      }

      return map.get(id).obj;
    })(),
  );

  useEffect(() => {
    const observers = map.get(id).observers;
    if (!observers.has(key)) {
      observers.set(key, new Map());
    }
    observers.get(key).set(hookIdRef.current, callback);

    return () => {
      observers.get(key).delete(hookIdRef.current);
    };
  }, []);

  return observableObjectRef.current;
};
