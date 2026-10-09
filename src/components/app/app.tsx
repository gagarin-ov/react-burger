import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import { BurgerIngredientsModal } from '@components/burger-ingredient-modal/burger-ingredient-modal';
import { Home } from '@components/home/home';
import { Layout } from '@components/layout/layout';
import { ProfileForm } from '@components/profile-form/profile-form';
import { ProtectedRoute, OnlyUnAuth } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { IngredientPage } from '@pages/ingredient/ingredient';
import { LoginPage } from '@pages/login/login';
import { NotFoundPage } from '@pages/not-found/not-found';
import { ProfileOrderPage } from '@pages/profile-order/profile-order';
import { ProfilePage } from '@pages/profile/profile';
import { RegisterPage } from '@pages/register/register';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';
import { checkUserAuth } from '@services/user/actions';

import type { TAppDispatch } from '@services/store';
import type { Location } from 'react-router-dom';

type TBackgroundLocationState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch<TAppDispatch>();
  const location = useLocation();
  const { background } = (location.state ?? {}) as TBackgroundLocationState;

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ingredients/:id" element={<IngredientPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="login" element={<OnlyUnAuth component={<LoginPage />} />} />
          <Route path="register" element={<OnlyUnAuth component={<RegisterPage />} />} />
          <Route
            path="forgot-password"
            element={<OnlyUnAuth component={<ForgotPasswordPage />} />}
          />
          <Route
            path="reset-password"
            element={<OnlyUnAuth component={<ResetPasswordPage />} />}
          />
          <Route path="profile" element={<ProtectedRoute component={<ProfilePage />} />}>
            <Route index element={<ProfileForm />} />
            <Route path="orders" element={<ProfileOrderPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<BurgerIngredientsModal />} />
        </Routes>
      )}
    </>
  );
};

export default App;
