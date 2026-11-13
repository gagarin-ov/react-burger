import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { FeedItem } from '@components/feed-item/feed-item';
import { Modal } from '@components/modal/modal';
import { useOrderByNumber } from '@hooks/use-order-by-number';
import { formatOrderNumber } from '@utils/orders';

export const FeedItemModal = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { order, isLoading } = useOrderByNumber();

  const handleClose = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  const renderContent = (): React.JSX.Element => {
    if (isLoading) {
      return <Preloader />;
    }
    if (!order) {
      return <p className="text text_type_main-default">Заказ не найден</p>;
    }
    return (
      <div className="mt-10">
        <FeedItem order={order} />
      </div>
    );
  };

  return (
    <Modal
      header={
        order && (
          <span className="text text_type_digits-default">
            #{formatOrderNumber(order.number)}
          </span>
        )
      }
      onClose={handleClose}
    >
      {renderContent()}
    </Modal>
  );
};

export default FeedItemModal;
