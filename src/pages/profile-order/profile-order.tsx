import { Link } from 'react-router-dom';

import styles from './profile-order.module.css';

export const ProfileOrderPage = (): React.JSX.Element => {
  return (
    <section className={styles.page}>
      <h1 className="text text_type_main-medium mb-6">
        Страница будет разработана позже
      </h1>
      <p className="text text_type_main-default text_color_inactive">
        <Link to="/" className={styles.link}>
          На главную
        </Link>
      </p>
    </section>
  );
};

export default ProfileOrderPage;
