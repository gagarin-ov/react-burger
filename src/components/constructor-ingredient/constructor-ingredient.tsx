import {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  type TConstructorIngredient,
} from '@/services/burger-constructor/slice';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import type { TIngredient } from '@utils/types';

import styles from './constructor-ingredient.module.css';

export const SORT_ITEM_TYPE = 'constructor-ingredient';

type TSortItem = {
  key: string;
  index: number;
};

type TConstructorIngredientProps = {
  ingredient: TConstructorIngredient;
  index: number;
};

export const ConstructorIngredient = ({
  ingredient,
  index,
}: TConstructorIngredientProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag<TSortItem, void, { isDragging: boolean }>(
    () => ({
      type: SORT_ITEM_TYPE,
      item: { key: ingredient.key, index },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient.key, index]
  );

  const [, dropRef] = useDrop<TSortItem | TIngredient, void, unknown>(
    () => ({
      accept: [SORT_ITEM_TYPE, 'ingredient'],
      hover: (item, monitor): void => {
        if (monitor.getItemType() !== SORT_ITEM_TYPE || !ref.current) return;
        const sortItem = item as TSortItem;
        const fromIndex = sortItem.index;
        if (fromIndex === index) return;

        // Перемещаем только когда курсор пересёк середину элемента
        const rect = ref.current.getBoundingClientRect();
        const middleY = (rect.bottom - rect.top) / 2;
        const offset = monitor.getClientOffset();
        if (!offset) return;
        const hoverY = offset.y - rect.top;
        if (fromIndex < index && hoverY < middleY) return;
        if (fromIndex > index && hoverY > middleY) return;

        dispatch(moveIngredient({ fromIndex, toIndex: index }));
        sortItem.index = index;
      },
      drop: (item, monitor): void => {
        if (monitor.getItemType() === 'ingredient') {
          dispatch(addIngredient(item as TIngredient, index));
        }
      },
    }),
    [index, dispatch]
  );

  dragRef(dropRef(ref));

  return (
    <li ref={ref} className={clsx(styles.item, isDragging && styles.isDragging)}>
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image_mobile}
        handleClose={() => dispatch(deleteIngredient(ingredient))}
      />
    </li>
  );
};
