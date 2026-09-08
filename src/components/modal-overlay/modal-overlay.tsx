import { useEffect } from 'react';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClose: (event?: React.SyntheticEvent) => void;
};

export const ModalOverlay = ({ onClose }: TModalOverlayProps): React.JSX.Element => {
  useEffect(() => {
    const handleEscape = (evt: KeyboardEvent): void => {
      if (evt.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return (): void => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return <div className={styles.overlay} onClick={onClose} />;
};

export default ModalOverlay;
