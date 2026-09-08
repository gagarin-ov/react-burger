import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: number;
};

export const OrderDetails = ({ orderNumber }: TOrderDetailsProps): React.JSX.Element => {
  return (
    <div className={clsx(styles.order, 'pt-30', 'pb-15')}>
      <p className={clsx(styles.number, 'text', 'text_type_digits-large')}>
        {String(orderNumber).padStart(6, '0')}
      </p>
      <p className="text text_type_main-medium mt-8">идентификатор заказа</p>
      <div className={clsx(styles.done, 'mt-15')}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className="text text_type_main-default mt-15">Ваш заказ начали готовить</p>
      <p
        className={clsx('text', 'text_type_main-default', 'text_color_inactive', 'mt-2')}
      >
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetails;
