import { readFileSync, writeFileSync } from 'node:fs';

// Бэкенд приложения (src/utils/const.ts). Маска вида '**/api/**' не подходит:
// она цепляет и исходники Vite (/src/api/*.ts).
export const API_URL = 'https://norma.education-services.ru/api';

/** Пути к записанным HAR-файлам (относительно корня проекта) */
export const HAR = {
  ingredients: 'e2e/hars/ingredients.har',
  orders: 'e2e/hars/orders.har',
  user: 'e2e/hars/user.har',
} as const;

/** Данные, которыми подменяется реальный владелец заказа */
export const FAKE_USER = {
  name: 'Тестовый пользователь',
  email: 'test-user@example.com',
} as const;

/** Заголовки, которые нельзя хранить в репозитории */
const SECRET_HEADERS = new Set(['authorization', 'cookie', 'set-cookie']);

type THarHeader = { name: string; value: string };
type THarEntry = {
  request: { headers: THarHeader[]; cookies: unknown[] };
  response: {
    headers: THarHeader[];
    cookies: unknown[];
    content: { text?: string; encoding?: string };
  };
};
type THar = { log: { entries: THarEntry[] } };

const stripHeaders = (headers: THarHeader[]): THarHeader[] =>
  headers.filter(({ name }) => !SECRET_HEADERS.has(name.toLowerCase()));

/** Поля с данными пользователя (заказ — owner, ответ auth/user — user) */
const USER_KEYS = new Set(['owner', 'user']);

/** Рекурсивно заменяет имя и email пользователя на фейковые данные */
const anonymize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(anonymize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) =>
        USER_KEYS.has(key) && item && typeof item === 'object'
          ? [key, { ...item, ...FAKE_USER }]
          : [key, anonymize(item)]
      )
    );
  }
  return value;
};

/**
 * Удаляет из HAR токены и персональные данные.
 * HAR должен быть записан с updateContent: 'embed' (тело ответа внутри файла).
 */
export function sanitizeHar(path: string): void {
  const har = JSON.parse(readFileSync(path, 'utf-8')) as THar;

  for (const entry of har.log.entries) {
    entry.request.headers = stripHeaders(entry.request.headers);
    entry.request.cookies = [];
    entry.response.headers = stripHeaders(entry.response.headers);
    entry.response.cookies = [];

    const { content } = entry.response;
    if (content.text && content.encoding !== 'base64') {
      try {
        content.text = JSON.stringify(anonymize(JSON.parse(content.text)));
      } catch {
        // не JSON — оставляем как есть
      }
    }
  }

  writeFileSync(path, `${JSON.stringify(har, null, 2)}\n`);
}
