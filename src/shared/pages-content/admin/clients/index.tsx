import { useState, useEffect } from 'react';
import { Table, Tag, Button, Input } from 'antd';
import { User, UserStatus } from './clients-data'; // Импорт интерфейсов для клиентов и статусов
import styles from './style.module.scss';

const { Search } = Input;

// Начальные данные клиентов
const initialClients: User[] = [
  { id: 1, firstName: 'Иван', lastName: 'Иванов', phone: '+380123456789', address: 'г. Киев, ул. Крещатик, 12', status: UserStatus.ACTIVE },
  { id: 2, firstName: 'Петр', lastName: 'Петров', phone: '+380987654321', address: 'г. Одесса, ул. Дерибасовская, 5', status: UserStatus.INACTIVE },
  { id: 3, firstName: 'Анна', lastName: 'Смирнова', phone: '+380555123456', address: 'г. Львов, ул. Шевченко, 10', status: UserStatus.ACTIVE },
];

const ClientsPageContent = () => {
  const [clients, setClients] = useState<User[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Обработчик поиска по имени или телефону
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filteredClients = initialClients.filter(client =>
      client.firstName.toLowerCase().includes(value.toLowerCase()) ||
      client.phone.includes(value)
    );
    setClients(filteredClients);
  };

  const handleStatusToggle = (clientId: number) => {
    const updatedClients = clients.map(client =>
      client.id === clientId
        ? { ...client, status: client.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE }
        : client
    );
    setClients(updatedClients);
  };

  const columns = [
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
      title: 'Номер телефона',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <Tag color={status === UserStatus.ACTIVE ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: User) => (
        <Button type="link" onClick={() => handleStatusToggle(record.id)}>
          {record.status === UserStatus.ACTIVE ? 'Деактивировать' : 'Активировать'}
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Управление клиентами</h1>
      <Search
        placeholder="Поиск по имени или телефону"
        onSearch={handleSearch}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Table columns={columns} dataSource={clients} rowKey="id" />
    </div>
  );
};

export default ClientsPageContent;
