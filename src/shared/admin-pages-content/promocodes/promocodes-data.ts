// Перечисление статусов промокодов
export enum PromocodeStatus {
    ACTIVE = 'Активен',
    INACTIVE = 'Неактивен',
  }
  
  // Интерфейс для данных промокода
  export interface Promocode {
    id: number;
    code: string;
    discount: number;
    expiryDate: string;
    status: PromocodeStatus;
  }
  