import { useDndContext } from '@/contexts/dnd-context';
import { clsx } from 'clsx';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';

import type { TIngredient } from '@/utils/types';

import styles from './burger-placeholder.module.css';
export type TIngredientType = 'bun' | 'ingredient';

type TBurgerPlaceholderProps = {
  type?: 'top' | 'bottom' | undefined;
  ingredientType: TIngredientType;
  caption: string;
  onDrop: (item: TIngredient) => void;
};

export function BurgerPlaceholder({
  type,
  ingredientType,
  caption,
  onDrop,
}: TBurgerPlaceholderProps): React.JSX.Element {
  const { draggingType } = useDndContext();

  const isAcceptable =
    draggingType &&
    ((ingredientType === 'bun' && draggingType === 'bun') ||
      (ingredientType !== 'bun' && draggingType !== 'bun'));

  const ref = useRef<HTMLDivElement>(null);
  const [, dropRef] = useDrop<TIngredient, void, unknown>(
    () => ({
      accept: ingredientType,
      drop: (item): void => onDrop(item),
    }),
    [ingredientType, onDrop]
  );
  dropRef(ref);

  return (
    <div
      ref={ref}
      className={clsx(
        styles.element,
        type === 'top' ? styles.posTop : undefined,
        type === 'bottom' ? styles.posBottom : undefined,
        isAcceptable ? styles.isAcceptable : undefined
      )}
    >
      <span className={styles.row}>
        <span className={styles.text}>{caption}</span>
      </span>
    </div>
  );
}
