import IBrand from './brand.interface';
import ICategory from './category.interface';
import IProduct, { IOption } from './product.interface';

interface IModelMenu extends IProduct {
  model_branded_store?: IBrand;
  model_branded_store_categories?: {
    id: number;
    name: string;
    branded_store_id: number;
  };
  model_general_categories?: ICategory;
}

export interface IModelMenuIngredientsCart {
  id: number;
  menu_cart_id: number;
  menu_ingredients_id: number;
  count: number;
  account_id: number;
  model_menu_ingredients: {
    id: number;
    branded_store: number;
    name: string;
    price: number;
    picture: string;
    options: string;
  };
}

export interface ICartItem {
  id: number;
  menu_id: number;
  account_id: number;
  count: number;
  model_menu: IModelMenu;
  option_id: number;
  model_options: IOption;
  model_menu_ingredients_cart: IModelMenuIngredientsCart[];
  item_cost: number;
}
