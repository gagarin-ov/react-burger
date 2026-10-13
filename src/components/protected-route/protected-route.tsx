import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

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
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
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
