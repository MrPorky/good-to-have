import { ReactElement, useMemo, useRef } from 'react';

type ReactElementType = ReactElement['type'] & { name: string };
type Node = null | ReactElement | (null | ReactElement)[];

const childrenToArray = (children: Node) => (Array.isArray(children) ? children : [children]);

/**
 * Hook to easily separate children to their specific type and error handling.
 *
 * @example
 *  const SingleElement = () => JSX.Element;
 *  const MultipleElemet = () => JSX.Element;
 *
 *  const { header, body, actions } = useCompoundChildren(children, {
 *    singelElement: SingleElement, // Only allows one child of this type
 *    multipleElemet: [MultipleElemet], // Allows multiple children of this tope
 *  });
 */
const useCompoundChildren = <T extends Record<string, ReactElementType | [ReactElementType]>>(
  children: Node,
  allowedTypes: T,
  allowNull = false,
) => {
  const ref = useRef(allowedTypes);

  return useMemo(() => {
    const childArray = childrenToArray(children);
    const childTypes = new Set<null | ReactElement['type']>(
      childArray.map((child) => (child === null ? null : child.type)),
    );

    if (allowNull) childTypes.delete(null);

    const seperatedChildren = Object.keys(ref.current).reduce((accumulator, key: keyof T) => {
      const types = ref.current[key];
      let type: ReactElementType | undefined;
      let childrenOfType: Node = null;

      if (Array.isArray(types)) {
        if (types.length !== 1) {
          throw new Error(
            'If allowedType is an array it shuld only contain one instance of that type. See example',
          );
        }

        [type] = types;

        childrenOfType = childArray.filter((child) => child?.type === type);
      } else {
        type = types;
        childrenOfType = childArray.filter((child) => child?.type === type);

        if (childrenOfType.length > 1) throw new Error(`Can only contain one <${type.name}/>`);

        childrenOfType = childrenOfType[0] ?? null;
      }

      childTypes.delete(type);

      return { ...accumulator, [key]: childrenOfType };
    }, {} as Record<keyof T, Node>);

    if (childTypes.size > 0) {
      throw new Error(`Unrecognized type(s)`);
    }

    return seperatedChildren;
  }, [allowNull, children]);
};

export default useCompoundChildren;
