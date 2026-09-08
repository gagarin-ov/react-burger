import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClose: (event?: React.SyntheticEvent) => void;
};

export const ModalOverlay = ({ onClose }: TModalOverlayProps): React.JSX.Element => {
  return <div className={styles.overlay} onClick={onClose} />;
};

export default ModalOverlay;
