import { Link } from 'react-router-dom';

import styles from './not-found.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className="text text_type_main-medium mb-6">Страница не найдена</h1>
        <p className="text text_type_main-default text_color_inactive">
          <Link to="/" className={styles.link}>
            На главную
          </Link>
        </p>
      </div>
    </main>
  );
};

export default NotFoundPage;
