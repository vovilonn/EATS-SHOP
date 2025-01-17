export enum PromocodeTypeValue {
  MONEY = 'MONEY',
  PERCENTAGE = 'PERCENTAGE',
}

export interface IPromocode {
  id: number;
  type: 'DISPOSABLE';
  count?: number;
  value: number;
  is_active: boolean;
  code: string;
  description: string | null;
  value_all_start: number;
  type_value: PromocodeTypeValue;
}

export interface IPromocodeCreateOrUpd {
  promo_code_id?: number;
  description: string;
  type: string;
  count: number;
  is_active: boolean;
  code: string;
  value: number;
  type_value?: PromocodeTypeValue;
}
