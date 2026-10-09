import { useResetPasswordMutation } from '@api/auth-api';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import {
  clearPasswordResetRequested,
  isPasswordResetRequested,
} from '@utils/password-reset';

import styles from './reset-password.module.css';

type TResetPasswordForm = {
  password: string;
  token: string;
};

const initialValues: TResetPasswordForm = {
  password: '',
  token: '',
};

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, handleChange, isValid } =
    useFormWithValidation<TResetPasswordForm>(initialValues);
  const [resetPassword, { isLoading, isError }] = useResetPasswordMutation();

  if (!isPasswordResetRequested()) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      await resetPassword(values).unwrap();
      clearPasswordResetRequested();
      void navigate('/login', { replace: true });
    } catch (error) {
      console.error('Ошибка сброса пароля', error);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <PasswordInput
          name="password"
          placeholder="Введите новый пароль"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          extraClass="mb-6"
        />
        <Input
          type="text"
          name="token"
          placeholder="Введите код из письма"
          autoComplete="one-time-code"
          value={values.token}
          onChange={handleChange}
          extraClass="mb-6"
        />
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
          disabled={!isValid || isLoading}
        >
          Сохранить
        </Button>
        {isError && (
          <p className="text text_type_main-default text_color_error mb-4">
            Не удалось сохранить пароль. Проверьте код из письма.
          </p>
        )}
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
};

export default ResetPasswordPage;
