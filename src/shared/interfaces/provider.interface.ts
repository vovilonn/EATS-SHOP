export default interface IProvider {
  id: number;
  number: string;
  name: string;
  role: 'PROVIDER';
  email: null | string;
  date_birth: null | string;
  gender: null | string;
  avatar: null | string;
  my_referral_code: null | string;
  referral_id: null | string;
  date_birthday: null | string;
  is_block: boolean;
  balance: number;
  total_amount_spent: number;
}
