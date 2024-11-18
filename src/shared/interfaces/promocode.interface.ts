export interface IPromocode {
  id: number;
  type: 'DISPOSABLE';
  count: number;
  value: number;
  is_active: boolean;
  code: string;
}

export interface IPromocodeCreateOrUpd {
  promo_code_id?: number;
  type: string;
  count: number;
  is_active: boolean;
  code: string;
}
