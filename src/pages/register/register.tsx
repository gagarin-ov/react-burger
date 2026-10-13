import { useRegisterMutation } from '@api/auth-api';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { getApiErrorMessage } from '@utils/request';

import styles from './register.module.css';

type TRegisterForm = {
  name: string;
  email: string;
  password: string;
};

const initialValues: TRegisterForm = {
  name: '',
  email: '',
  password: '',
};

export const RegisterPage = (): React.JSX.Element => {
  const [register, { isLoading, error }] = useRegisterMutation();
  const { values, handleChange, isValid } =
    useFormWithValidation<TRegisterForm>(initialValues);
  const errorMessage = getApiErrorMessage(error);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void register(values);
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
        <Input
          type="text"
          name="name"
          placeholder="Имя"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          extraClass="mb-6"
        />
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
          autoComplete="new-password"
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
          Зарегистрироваться
        </Button>
        {errorMessage && (
          <p className="text text_type_main-default text_color_error mb-4">
            {errorMessage}
          </p>
        )}
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
};

export default RegisterPage;
