import { useDndContext } from '@/contexts/dnd-context';
import { setBun } from '@/services/burger-constructor/slice';
import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import type { TIngredient } from '@utils/types';

import styles from './constructor-bun.module.css';

type TConstructorBunProps = {
  bun: TIngredient;
  type: 'top' | 'bottom';
};

// Установленная булка: принимает только булки и заменяет текущую
export const ConstructorBun = ({
  bun,
  type,
}: TConstructorBunProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const { draggingType } = useDndContext();

  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, dropRef] = useDrop<TIngredient, void, { isOver: boolean }>(
    () => ({
      accept: 'bun',
      drop: (item): void => {
        dispatch(setBun(item));
      },
      collect: (monitor): { isOver: boolean } => ({ isOver: monitor.isOver() }),
    }),
    [dispatch]
  );
  dropRef(ref);

  return (
    <div
      ref={ref}
      className={clsx(
        styles.wrapper,
        type === 'top' ? styles.posTop : styles.posBottom,
        draggingType === 'bun' && styles.isAcceptable,
        isOver && styles.isOver
      )}
    >
      <ConstructorElement
        type={type}
        isLocked={true}
        text={`${bun.name} (${type === 'top' ? 'верх' : 'низ'})`}
        price={bun.price}
        thumbnail={bun.image_mobile}
      />
    </div>
  );
};
