import { authApi, useLogoutMutation } from '@api/auth-api';
import { clsx } from 'clsx';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet, useMatch, useNavigate } from 'react-router-dom';

import { setUser } from '@services/user/slice';
import { clearTokens } from '@utils/token';

import styles from './profile.module.css';

const getLinkClass = ({ isActive }: { isActive: boolean }): string =>
  clsx(
    styles.link,
    'text',
    'text_type_main-medium',
    isActive ? styles.active : 'text_color_inactive'
  );

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const isOrdersRoute = Boolean(useMatch('/profile/orders/*'));

  const handleLogout = async (): Promise<void> => {
    try {
      await logout().unwrap();
    } catch {
      clearTokens();
      dispatch(setUser(null));
    } finally {
      dispatch(authApi.util.resetApiState());
      void navigate('/login', { replace: true });
    }
  };

  return (
    <main className={styles.page}>
      <div className={clsx(styles.sidebar, 'mr-15')}>
        <nav className="mb-20">
          <NavLink to="/profile" end className={getLinkClass}>
            Профиль
          </NavLink>
          <NavLink to="/profile/orders" className={getLinkClass}>
            История заказов
          </NavLink>
          <button
            type="button"
            className={clsx(
              styles.link,
              styles.logout,
              'text',
              'text_type_main-medium',
              'text_color_inactive'
            )}
            disabled={isLoading}
            onClick={() => void handleLogout()}
          >
            Выход
          </button>
        </nav>
        <p className="text text_type_main-default text_color_inactive">
          {isOrdersRoute
            ? 'В этом разделе вы можете просмотреть свою историю заказов'
            : 'В этом разделе вы можете изменить свои персональные данные'}
        </p>
      </div>
      <Outlet />
    </main>
  );
};

export default ProfilePage;
