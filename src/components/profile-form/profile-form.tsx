import { useUpdateUserMutation } from '@api/auth-api';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { selectUser } from '@services/user/slice';

import type { TUpdateUserPayload, TUser } from '@api/auth-api';

import styles from './profile-form.module.css';

type TProfileForm = {
  name: string;
  email: string;
  password: string;
};

const getInitialValues = (user: TUser | null): TProfileForm => ({
  name: user?.name ?? '',
  email: user?.email ?? '',
  password: '',
});

export const ProfileForm = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();
  const initialValues = useMemo(() => getInitialValues(user), [user]);
  const { values, handleChange, validity, resetForm } =
    useFormWithValidation<TProfileForm>(initialValues);

  useEffect(() => {
    resetForm(initialValues);
  }, [initialValues, resetForm]);

  // Пароль необязателен: пустое поле означает, что его не меняют
  const isValid =
    validity.name && validity.email && (values.password === '' || validity.password);
  const isChanged =
    values.name !== initialValues.name ||
    values.email !== initialValues.email ||
    values.password !== '';

  const errorMessage = error ? 'Не удалось сохранить данные' : null;

  const handleCancel = (): void => {
    resetForm(initialValues);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!isValid) return;

    const changedFields: TUpdateUserPayload = {};
    if (values.name !== initialValues.name) changedFields.name = values.name;
    if (values.email !== initialValues.email) changedFields.email = values.email;
    if (values.password) changedFields.password = values.password;

    try {
      await updateUser(changedFields).unwrap();
    } catch (updateError) {
      console.error('Ошибка обновления профиля', updateError);
    }
  };

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        icon="EditIcon"
        autoComplete="name"
        value={values.name}
        onChange={handleChange}
        extraClass="mb-6"
      />
      <EmailInput
        name="email"
        placeholder="Логин"
        isIcon
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        extraClass="mb-6"
      />
      <PasswordInput
        name="password"
        icon="EditIcon"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
      />
      {errorMessage && (
        <p className="text text_type_main-default text_color_error mt-4">
          {errorMessage}
        </p>
      )}
      {isChanged && (
        <div className={`${styles.buttons} mt-6`}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            disabled={!isValid || isLoading}
          >
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
