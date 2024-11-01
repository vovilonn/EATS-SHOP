// Перечисление статусов заказа
export enum OrderStatus {
    PENDING = 'В ожидании',
    COMPLETED = 'Завершён',
    CANCELED = 'Отменён',
  }
  
  // Интерфейс заказа
  export interface Order {
    id: number;
    clientName: string;
    phone: string;
    address: string;
    status: OrderStatus;
    orderDate: string;
    total: number;
  }
  
  // Начальные данные для заказов
  export const initialOrders: Order[] = [
    {
      id: 1,
      clientName: 'Иван Иванов',
      phone: '+380123456789',
      address: 'г. Киев, ул. Крещатик, 12',
      status: OrderStatus.PENDING,
      orderDate: '2024-10-25',
      total: 1200,
    },
    {
      id: 2,
      clientName: 'Петр Петров',
      phone: '+380987654321',
      address: 'г. Одесса, ул. Дерибасовская, 5',
      status: OrderStatus.COMPLETED,
      orderDate: '2024-10-20',
      total: 1500,
    },
    {
      id: 3,
      clientName: 'Анна Смирнова',
      phone: '+380555123456',
      address: 'г. Львов, ул. Шевченко, 10',
      status: OrderStatus.CANCELED,
      orderDate: '2024-10-18',
      total: 800,
    },
    // Добавьте другие заказы при необходимости
  ];
  