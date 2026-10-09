const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const NAME_REGEX = /^[A-Za-zА-Яа-яЁё0-9\s-]{2,}$/;

export type TValidator = {
  validator: (value: string) => boolean;
  message: string;
};

export const validators: Record<string, TValidator | undefined> = {
  name: {
    validator: (value: string): boolean => NAME_REGEX.test(value.trim()),
    message: 'Укажите корректное имя.',
  },
  email: {
    validator: (value: string): boolean => EMAIL_REGEX.test(value.trim()),
    message: 'Укажите корректный email.',
  },
  password: {
    validator: (value: string): boolean => PASSWORD_REGEX.test(value.trim()),
    message: 'Укажите пароль посложнее.',
  },
};
