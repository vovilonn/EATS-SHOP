import { useState } from 'react';
import { Table, Select, Checkbox, Button, Input, message } from 'antd';
import { User, roles, availablePermissions } from './mock';

const { Option } = Select;

const initialUsers: User[] = [
  {
    id: 1,
    phone: '+380123456789',
    firstName: '',
    lastName: '',
    role: 'Оператор',
    customPermissions: [],
  },
  {
    id: 2,
    phone: '+380987654321',
    firstName: '',
    lastName: '',
    role: 'Админ',
    customPermissions: [],
  },
];

const RolePageContent = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Выбор пользователя
  const handleUserSelect = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);
  };

  // Назначение роли пользователю
  const handleRoleChange = (role: string) => {
    if (selectedUser) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, role } : user
      );
      setUsers(updatedUsers);
    }
  };

  // Изменение разрешений для настраиваемой роли
  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    if (selectedUser) {
      const updatedPermissions = checked
        ? [
            ...selectedUser.customPermissions!,
            availablePermissions.find((p) => p.key === permissionKey)!,
          ]
        : selectedUser.customPermissions!.filter(
            (p) => p.key !== permissionKey
          );

      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, customPermissions: updatedPermissions }
          : user
      );
      setUsers(updatedUsers);
    }
  };

  // Сохранение имени и фамилии
  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    if (selectedUser) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, [field]: value } : user
      );
      setUsers(updatedUsers);
    }
  };

  // Обработчик сохранения
  const handleSave = () => {
    message.success('Изменения успешно сохранены!');
  };

  const columns = [
    {
      title: 'Номер телефона',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Имя',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  return (
    <div>
      <h1>Управление ролями пользователей</h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleUserSelect(record.id),
        })}
      />

      {selectedUser && (
        <div style={{ marginTop: '20px' }}>
          <h2>Настройка для {selectedUser.phone}</h2>

          {/* Поля для имени и фамилии */}
          <div>
            <Input
              placeholder="Имя"
              value={selectedUser.firstName}
              onChange={(e) => handleNameChange('firstName', e.target.value)}
              disabled={selectedUser.role !== 'Главный Админ'} // Только главный админ может редактировать имя
              style={{ width: '200px', marginRight: '10px' }}
            />
            <Input
              placeholder="Фамилия"
              value={selectedUser.lastName}
              onChange={(e) => handleNameChange('lastName', e.target.value)}
              disabled={selectedUser.role !== 'Главный Админ'}
              style={{ width: '200px' }}
            />
          </div>

          {/* Выбор роли */}
          <div style={{ marginTop: '20px' }}>
            <Select
              value={selectedUser.role} // Важно: `value` — это строка с именем роли, а не объект
              onChange={handleRoleChange}
              style={{ width: '200px' }}
            >
              {roles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option> // Передаем строку роли
              ))}
            </Select>
          </div>

          {/* Настройка прав для настраиваемой роли */}
          {selectedUser.role === 'Настраиваемая роль' && (
            <div style={{ marginTop: '20px' }}>
              <h3>Выбор разрешений:</h3>
              {availablePermissions.map((permission) => (
                <Checkbox
                  key={permission.key}
                  checked={selectedUser.customPermissions?.some(
                    (p) => p.key === permission.key
                  )}
                  onChange={(e) =>
                    handlePermissionChange(permission.key, e.target.checked)
                  }
                >
                  {permission.name}
                </Checkbox>
              ))}
            </div>
          )}

          <Button
            type="primary"
            onClick={handleSave}
            style={{ marginTop: '20px' }}
          >
            Сохранить изменения
          </Button>
        </div>
      )}
    </div>
  );
};

export default RolePageContent;
