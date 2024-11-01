// Пользователь
export interface User {
    id: number;
    phone: string;
    firstName: string;
    lastName: string;
    role: string;
    customPermissions?: Permission[];
  }
  
  // Возможные роли
  export const roles = ['Супер Админ', 'Главный Админ', 'Админ', 'Оператор', 'Настраиваемая роль'];
  
  // Возможные действия (Permission)
  export interface Permission {
    name: string;
    key: string;
  }
  
  // Пример списка всех доступных действий на сайте
  export const availablePermissions: Permission[] = [
    { name: 'Управление пользователями', key: 'manage_users' },
    { name: 'Просмотр заказов', key: 'view_orders' },
    { name: 'Редактирование товаров', key: 'edit_products' },
    { name: 'Просмотр статистики', key: 'view_statistics' },
    // Добавьте другие действия по мере необходимости
  ];

  