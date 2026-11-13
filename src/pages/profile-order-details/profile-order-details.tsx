import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { OrderInfo } from '@components/order-info/order-info';
import { useOrderByNumber } from '@hooks/use-order-by-number';

import styles from './profile-order-details.module.css';

export const ProfileOrderDetailsPage = (): React.JSX.Element => {
  const { order, isLoading } = useOrderByNumber();

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <main className={styles.page}>
      <OrderInfo order={order} />
    </main>
  );
};

export default ProfileOrderDetailsPage;
