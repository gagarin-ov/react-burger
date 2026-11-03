import type { TFeedOrderStatus, TIngredient } from '@utils/types';

export const formatOrderNumber = (number: number): string =>
  number.toString().padStart(6, '0');

export const ORDER_STATUS_LABELS: Record<TFeedOrderStatus, string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};

export type TOrderIngredient = {
  ingredient: TIngredient;
  count: number;
};

// Уникальные ингредиенты заказа с количеством и итоговая стоимость
export const getOrderIngredients = (
  ids: string[],
  allIngredients: TIngredient[]
): { items: TOrderIngredient[]; price: number } => {
  const byId = new Map(allIngredients.map((item) => [item._id, item]));
  const counts = new Map<string, TOrderIngredient>();
  let price = 0;

  for (const id of ids) {
    const ingredient = byId.get(id);
    if (!ingredient) continue;
    price += ingredient.price;
    const entry = counts.get(id);
    if (entry) entry.count += 1;
    else counts.set(id, { ingredient, count: 1 });
  }

  return { items: [...counts.values()], price };
};
