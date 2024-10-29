import { useState } from 'react';
import { Table, Tag, Button, Input } from 'antd';
import { Promocode, PromocodeStatus } from './promocodes-data'; // Импорт интерфейсов для промокодов и статусов
import styles from './style.module.scss';

const { Search } = Input;

// Начальные данные для промокодов
const initialPromocodes: Promocode[] = [
  { id: 1, code: 'DISCOUNT10', discount: 10, expiryDate: '2024-12-31', status: PromocodeStatus.ACTIVE },
  { id: 2, code: 'BLACKFRIDAY', discount: 20, expiryDate: '2024-11-24', status: PromocodeStatus.INACTIVE },
  { id: 3, code: 'WELCOME15', discount: 15, expiryDate: '2025-01-10', status: PromocodeStatus.ACTIVE },
];

const PromocodesPageContent = () => {
  const [promocodes, setPromocodes] = useState<Promocode[]>(initialPromocodes);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filteredPromocodes = initialPromocodes.filter(promo =>
      promo.code.toLowerCase().includes(value.toLowerCase())
    );
    setPromocodes(filteredPromocodes);
  };

  const handleStatusToggle = (promocodeId: number) => {
    const updatedPromocodes = promocodes.map(promo =>
      promo.id === promocodeId
        ? { ...promo, status: promo.status === PromocodeStatus.ACTIVE ? PromocodeStatus.INACTIVE : PromocodeStatus.ACTIVE }
        : promo
    );
    setPromocodes(updatedPromocodes);
  };

  const columns = [
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Скидка (%)',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Дата истечения',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: PromocodeStatus) => (
        <Tag color={status === PromocodeStatus.ACTIVE ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Promocode) => (
        <Button type="link" onClick={() => handleStatusToggle(record.id)}>
          {record.status === PromocodeStatus.ACTIVE ? 'Деактивировать' : 'Активировать'}
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Управление промокодами</h1>
      <Search
        placeholder="Поиск по коду"
        onSearch={handleSearch}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Table columns={columns} dataSource={promocodes} rowKey="id" />
    </div>
  );
};

export default PromocodesPageContent;
