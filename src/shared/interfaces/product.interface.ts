import IComponent from './component.interface';

export interface IOption {
  id: number;
  name: string;
  price: number;
  weight: number;
}

export default interface IProduct {
  id: number;
  name: string;
  composition: string;
  options: Array<IOption>;
  picture: Array<string>;
  is_favorite: boolean;
  model_additional_components: IComponent[];
}
