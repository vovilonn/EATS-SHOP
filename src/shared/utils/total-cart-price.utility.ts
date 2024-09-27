import { IModelMenuIngredientsCart } from '../interfaces/cart-item.interface';

const totalCartPrice = (
  model_menu_ingredients_cart: IModelMenuIngredientsCart[]
) => {
  return model_menu_ingredients_cart.reduce(
    (acc, item) => acc + item.count * item.model_menu_ingredients.price,
    0
  );
};

export default totalCartPrice;
