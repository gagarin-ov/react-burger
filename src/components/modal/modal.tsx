import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modal');

type TModalProps = {
  children: React.ReactNode;
  header?: string;
  onClose: () => void;
};

export const Modal = ({
  children,
  header,
  onClose,
}: TModalProps): React.JSX.Element | null => {
  useEffect(() => {
    const handleEscape = (evt: KeyboardEvent): void => {
      if (evt.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return (): void => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!modalRoot) {
    return null;
  }

  const handleClose = (event?: React.SyntheticEvent): void => {
    event?.stopPropagation();
    onClose();
  };

  return createPortal(
    <>
      <ModalOverlay onClose={handleClose} />
      <div className={styles.modal}>
        <div className={clsx(styles.header, 'pt-10', 'pl-10', 'pr-10')}>
          <h3 className="text text_type_main-large">{header}</h3>
          <CloseIcon type="primary" className={styles.close} onClick={handleClose} />
        </div>
        <div className={clsx(styles.content, 'pl-10', 'pr-10', 'pb-15')}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};

export default Modal;
