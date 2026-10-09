import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { Link, NavLink, useMatch } from 'react-router-dom';

import styles from './app-header.module.css';

const getIconType = (isActive: boolean): 'primary' | 'secondary' =>
  isActive ? 'primary' : 'secondary';

export const AppHeader = (): React.JSX.Element => {
  // Конструктор остаётся активным и на странице ингредиента
  const isIngredientRoute = Boolean(useMatch('/ingredients/:id'));

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              clsx(styles.link, (isActive || isIngredientRoute) && styles.link_active)
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={getIconType(isActive || isIngredientRoute)} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              clsx(styles.link, 'ml-10', isActive && styles.link_active)
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={getIconType(isActive)} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <Link to="/" className={styles.logo}>
          <Logo />
        </Link>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            clsx(styles.link, styles.link_position_last, isActive && styles.link_active)
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={getIconType(isActive)} />
              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
