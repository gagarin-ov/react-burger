import { clsx } from 'clsx';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-icon.module.css';

type TIngredientIconProps = {
  ingredient: TIngredient;
  hiddenCount?: number;
  className?: string;
  style?: React.CSSProperties;
};

export const IngredientIcon = ({
  ingredient,
  hiddenCount = 0,
  className,
  style,
}: TIngredientIconProps): React.JSX.Element => {
  return (
    <div className={clsx(styles.icon, className)} style={style}>
      <img
        className={clsx(styles.image, hiddenCount > 0 && styles.imageDimmed)}
        src={ingredient.image_mobile}
        alt={ingredient.name}
      />
      {hiddenCount > 0 && (
        <span className={clsx(styles.more, 'text', 'text_type_main-default')}>
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};
