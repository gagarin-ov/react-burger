import { useLoginMutation } from '@api/auth-api';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { getApiErrorMessage } from '@utils/request';

import styles from './login.module.css';

type TLoginForm = {
  email: string;
  password: string;
};

const initialValues: TLoginForm = {
  email: '',
  password: '',
};

export const LoginPage = (): React.JSX.Element => {
  const [login, { isLoading, error }] = useLoginMutation();

  const { values, handleChange, isValid } =
    useFormWithValidation<TLoginForm>(initialValues);
  const errorMessage = getApiErrorMessage(error);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void login(values);
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>
        <EmailInput
          name="email"
          placeholder="E-mail"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          extraClass="mb-6"
        />
        <PasswordInput
          name="password"
          autoComplete="current-password"
          value={values.password}
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
          Войти
        </Button>
        {errorMessage && (
          <p className="text text_type_main-default text_color_error mb-4">
            {errorMessage}
          </p>
        )}
        <p className="text text_type_main-default text_color_inactive mb-4">
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
