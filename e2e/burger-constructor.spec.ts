import { expect, test, type Page } from '@playwright/test';

import { mockApi, mockAuth } from './utils/mocks';

const BUN_1 = /Краторная булка/i;
const BUN_2 = /Флюоресцентная булка/i;
const MAIN_1 = /Биокотлета из марсианской Магнолии/i;

// Номер заказа из e2e/hars/orders.har
const ORDER_NUMBER = '105912';

/** Все элементы страницы, которые используются в тестах, — в одном месте */
const getElements = (page: Page) => {
  const modal = page.getByTestId('modal');

  return {
    bunCards: page.getByTestId('ingredients-bun-list').locator('li'),
    mainCards: page.getByTestId('ingredients-main-list').locator('li'),
    emptyTopBun: page.getByTestId('empty-top-bun'),
    emptyBottomBun: page.getByTestId('empty-bottom-bun'),
    topBun: page.getByTestId('top-bun'),
    bottomBun: page.getByTestId('bottom-bun'),
    fillingPlaceholder: page.getByTestId('ingredient-placeholder'),
    constructorItems: page.locator('[data-testid^="constructor-ingredient-"]'),
    orderButton: page.getByRole('button', { name: /оформить/i }),
    modal,
    ingredientDetails: modal.getByTestId('modal-ingredient'),
    orderNumber: modal.getByTestId('order-number'),
    modalCloseButton: modal.getByTestId('modal-header').locator('svg'),
  };
};

async function fillConstructor(page: Page): Promise<void> {
  const {
    bunCards,
    mainCards,
    emptyTopBun,
    topBun,
    fillingPlaceholder,
    constructorItems,
  } = getElements(page);

  await bunCards.filter({ hasText: BUN_1 }).dragTo(emptyTopBun);
  await expect(topBun).toContainText(BUN_1);

  await mainCards.filter({ hasText: MAIN_1 }).dragTo(fillingPlaceholder);
  await expect(constructorItems).toHaveCount(1);
}

/** Открывает конструктор, собирает бургер и нажимает «Оформить заказ» */
async function placeOrder(page: Page): Promise<void> {
  await page.goto('/');
  await fillConstructor(page);
  await getElements(page).orderButton.click();
}

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test.describe('страница Конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();
  });

  test('отображает ингредиенты из API', async ({ page }) => {
    const { bunCards, mainCards } = getElements(page);

    await expect(bunCards.nth(0)).toContainText(BUN_1);
    await expect(bunCards.nth(1)).toContainText(BUN_2);
    await expect(mainCards.nth(0)).toContainText(MAIN_1);
  });

  test('перетаскивание булки и начинки в конструктор', async ({ page }) => {
    const {
      bunCards,
      mainCards,
      emptyTopBun,
      emptyBottomBun,
      topBun,
      bottomBun,
      fillingPlaceholder,
      constructorItems,
    } = getElements(page);

    await expect(emptyTopBun).toBeVisible();
    await expect(fillingPlaceholder).toBeVisible();

    await bunCards.filter({ hasText: BUN_1 }).dragTo(emptyTopBun);
    await expect(emptyTopBun).toHaveCount(0);
    await expect(emptyBottomBun).toHaveCount(0);
    await expect(topBun).toContainText(BUN_1);
    await expect(bottomBun).toContainText(BUN_1);

    // Новая булка заменяет предыдущую сверху и снизу
    await bunCards.filter({ hasText: BUN_2 }).dragTo(topBun);
    await expect(topBun).toContainText(BUN_2);
    await expect(bottomBun).toContainText(BUN_2);

    await mainCards.filter({ hasText: MAIN_1 }).dragTo(fillingPlaceholder);
    await expect(fillingPlaceholder).toHaveCount(0);
    await expect(constructorItems).toHaveCount(1);
    await expect(constructorItems.first()).toContainText(MAIN_1);
  });

  test.describe('модальное окно ингредиента', () => {
    test.beforeEach(async ({ page }) => {
      const { mainCards, ingredientDetails } = getElements(page);

      await mainCards.filter({ hasText: MAIN_1 }).click();
      await expect(ingredientDetails).toBeVisible();
    });

    test('отображает данные ингредиента и закрывается по Escape', async ({ page }) => {
      const { modal, ingredientDetails } = getElements(page);

      await expect(ingredientDetails.getByTestId('name')).toHaveText(MAIN_1);
      await expect(ingredientDetails.getByTestId('calories')).toHaveText('4242');
      await expect(ingredientDetails.getByTestId('proteins')).toHaveText('420');
      await expect(ingredientDetails.getByTestId('fat')).toHaveText('142');
      await expect(ingredientDetails.getByTestId('carbohydrates')).toHaveText('242');

      await page.keyboard.press('Escape');
      await expect(modal).toBeHidden();
    });

    test('закрытие кнопкой закрытия', async ({ page }) => {
      const { modal, modalCloseButton } = getElements(page);

      await modalCloseButton.click();
      await expect(modal).toBeHidden();
    });
  });
});

test.describe('Оформление заказа', () => {
  test('неавторизованного пользователя отправляет на логин', async ({ page }) => {
    await placeOrder(page);
    await expect(page).toHaveURL(/\/login$/);
  });

  test.describe('авторизованный пользователь', () => {
    test.beforeEach(async ({ page, baseURL }) => {
      await mockAuth(page, baseURL!);
      await placeOrder(page);
    });

    test('видит номер заказа', async ({ page }) => {
      const { modal, orderNumber } = getElements(page);

      await expect(orderNumber).toHaveText(ORDER_NUMBER);
      await expect(modal.getByText('идентификатор заказа')).toBeVisible();
      await expect(modal.getByText('Ваш заказ начали готовить')).toBeVisible();
      await expect(
        modal.getByText('Дождитесь готовности на орбитальной станции')
      ).toBeVisible();
    });

    test('модальное окно заказа: закрытие кнопкой закрытия', async ({ page }) => {
      const { modal, orderNumber, modalCloseButton } = getElements(page);

      await expect(orderNumber).toBeVisible();

      await modalCloseButton.click();
      await expect(modal).toBeHidden();
    });
  });
});
