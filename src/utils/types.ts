export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TFeedOrderStatus = 'created' | 'pending' | 'done';

export type TFeedOrder = {
  _id: string;
  ingredients: string[];
  status: TFeedOrderStatus;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type TFeed = {
  orders: TFeedOrder[];
  total: number;
  totalToday: number;
};
