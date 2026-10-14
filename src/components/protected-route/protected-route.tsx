import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/store';
import { selectIsAuthChecked, selectUser } from '@services/user/slice';

import type { Location } from 'react-router-dom';

type TProtectedRouteProps = {
  component: React.JSX.Element;
  onlyUnAuth?: boolean;
};

export type TFromLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  component,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const { from } = (location.state ?? {}) as TFromLocationState;
    return <Navigate to={from ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return component;
};

export const OnlyUnAuth = ({
  component,
}: Pick<TProtectedRouteProps, 'component'>): React.JSX.Element => (
  <ProtectedRoute component={component} onlyUnAuth />
);
