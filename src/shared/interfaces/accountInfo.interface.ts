import ICity from './city.interface';

export default interface IAccountInfo {
  id: number;
  number: string;
  name: string;
  model_city: ICity;
  role: string;
  email?: string;
  date_birth?: string;
  gender?: string;
  avatar?: string;
  my_referral_code: number;
  referral_id?: string;
  date_birthday?: string;
  balance: number;
}
