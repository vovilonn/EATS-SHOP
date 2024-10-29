// Перечисление статусов пользователя
export enum UserStatus {
    ACTIVE = 'Активен',
    INACTIVE = 'Неактивен',
  }
  
  // Интерфейс для данных пользователя (клиента)
  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    status: UserStatus;
  }
  