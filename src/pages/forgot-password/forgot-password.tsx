import { useForgotPasswordMutation } from '@api/auth-api';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { markPasswordResetRequested } from '@utils/password-reset';

import styles from './forgot-password.module.css';

type TForgotPasswordForm = {
  email: string;
};

const initialValues: TForgotPasswordForm = {
  email: '',
};

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, handleChange, isValid } =
    useFormWithValidation<TForgotPasswordForm>(initialValues);
  const [forgotPassword, { isLoading, isError }] = useForgotPasswordMutation();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      await forgotPassword(values).unwrap();
      markPasswordResetRequested();
      void navigate('/reset-password', { replace: true });
    } catch (error) {
      console.error('Ошибка запроса восстановления пароля', error);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <EmailInput
          name="email"
          placeholder="Укажите e-mail"
          autoComplete="email"
          value={values.email}
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
          Восстановить
        </Button>
        {isError && (
          <p className="text text_type_main-default text_color_error mb-4">
            Не удалось отправить письмо. Попробуйте ещё раз.
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

export default ForgotPasswordPage;
