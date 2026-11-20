/**
 * Запись HAR-файлов для e2e-тестов.
 *
 * ВНИМАНИЕ: ходит в реальное API и создаёт настоящий заказ.
 * Запуск только вручную:
 *   E2E_EMAIL=... E2E_PASSWORD=... npm run e2e:record
 * (или положите переменные в .env.e2e)
 *
 * Сценарий должен совпадать со сценарием теста заказа: Playwright сопоставляет
 * POST-запросы из HAR по телу, поэтому набор и порядок ингредиентов важен.
 */
import { expect, test, type Page } from '@playwright/test';

import { API_URL, HAR, sanitizeHar } from '../utils/har';

const { E2E_EMAIL, E2E_PASSWORD } = process.env;

const BUN_1 = /Краторная булка/i;
const MAIN_1 = /Биокотлета из марсианской Магнолии/i;

/**
 * Копия fillConstructor из e2e/burger-constructor.spec.ts. Импортировать её
 * из спека нельзя: вместе с ней в запись попали бы все тесты спека.
 * При изменении сценария меняйте обе копии, иначе тело POST /orders
 * разойдётся с записанным HAR.
 */
async function fillConstructor(page: Page): Promise<void> {
  await page.getByTestId('ingredients-bun-list').locator('li').filter({ hasText: BUN_1 }).dragTo(page.getByTestId('empty-top-bun'));
  await expect(page.getByTestId('top-bun')).toContainText(BUN_1);

  await page.getByTestId('ingredients-main-list').locator('li').filter({ hasText: MAIN_1 }).dragTo(page.getByTestId('ingredient-placeholder'));
  await expect(page.getByTestId('constructor-list').locator('li')).toHaveCount(1);
}

test('запись HAR: ингредиенты и оформление заказа', async ({ browser }, testInfo) => {
  test.skip(!E2E_EMAIL || !E2E_PASSWORD, 'Не заданы E2E_EMAIL / E2E_PASSWORD');

  // Отдельный контекст, чтобы закрыть его внутри теста: HAR пишется на диск
  // только при закрытии контекста, а после этого его нужно очистить от секретов.
  const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
  const page = await context.newPage();

  // Роуты ставим ДО навигации, чтобы перехватить первые запросы
  const harOptions = {
    update: true,
    updateContent: 'embed',
    updateMode: 'minimal',
  } as const;
  await page.routeFromHAR(HAR.ingredients, {
    ...harOptions,
    url: `${API_URL}/ingredients`,
  });
  await page.routeFromHAR(HAR.orders, { ...harOptions, url: `${API_URL}/orders` });
  await page.routeFromHAR(HAR.user, { ...harOptions, url: `${API_URL}/auth/user` });

  await page.goto('/login');
  await page.locator('input[name="email"]').fill(E2E_EMAIL!);
  await page.locator('input[name="password"]').fill(E2E_PASSWORD!);
  await page.getByRole('button', { name: /войти/i }).click();
  await page.waitForURL('/');

  // После перезагрузки приложение проверяет токен запросом GET /auth/user
  const userResponse = page.waitForResponse(`${API_URL}/auth/user`);
  await page.reload();
  expect((await userResponse).ok()).toBe(true);

  await fillConstructor(page);

  // Ожидание ставим до клика, иначе быстрый ответ можно пропустить
  const orderResponse = page.waitForResponse(`${API_URL}/orders`);
  await page.getByRole('button', { name: /оформить/i }).click();
  expect((await orderResponse).ok()).toBe(true);
  await expect(page.getByTestId('order-number')).toBeVisible({ timeout: 30_000 });

  await context.close();

  sanitizeHar(HAR.ingredients);
  sanitizeHar(HAR.orders);
  sanitizeHar(HAR.user);
});
