import IAccountInfo from './accountInfo.interface';
import { ICartItem } from './cart-item.interface';

export default interface IOrder {
  id: number;
  title: string;
  status: string;
  date: string;
  address: string;
  picture: Array<string>;
  price: number;
}

export interface IOrderOption {
  delivery_price: number;
  min_delivery_not_price: number;
}

export interface IOrderCreate {
  address: string;
  entrance: string;
  call_back: boolean;
  floor: string;
  apartment: string;
  type_payment: string;
  type_delivery: string;
  count_eats_coin: number;
  comment: string | null;
  promo_code_id: string | null;
  prepare_rest: string | null;
}

export type StatusOrder =
  | 'NEWORDER'
  | 'PROGRESS'
  | 'DELIVERY'
  | 'WAITINGPAYMENT'
  | 'DELIVERED'
  | 'CANCELED';

export interface IOrdersHistory {
  id: number;
  cart: {
    cart_items: ICartItem[];
    total_cart: number;
    total_cost: number;
  };
  address:
    | string
    | {
        formatted_address: string;
      };
  entrance: string;
  call_back: boolean;
  floor: number;
  apartment: string;
  type_payment: 'ONLINE' | 'CASH';
  type_delivery: 'DELIVERY' | 'SELF-DELIVERY';
  comment: string | null;
  count_eats_coin: number;
  promo_code_data: string | null;
  cost_order: number;
  discount_promo_code: string | null;
  cost_delivery: number;
  cost_total_order: number;
  invoice_id: string;
  data_payment: {
    pageUrl: string;
    invoiceId: string;
  };
  payment_url: string;
  prepare_rest: null;
  status_order: StatusOrder;
  account_id: number;
  status_payment: string;
  createdAt: number;
  city_id: string | null;
  model_account: IAccountInfo;
}
