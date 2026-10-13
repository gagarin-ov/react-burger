import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

export const BurgerIngredientsModal = (): React.JSX.Element => {
  const navigate = useNavigate();

  const handleClose = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  return (
    <Modal header="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

export default BurgerIngredientsModal;
