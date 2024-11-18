import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import IOrder from '@/shared/interfaces/order.interface';

import { fetchProviderOrders } from '@/shared/store/admin/provider/requests';

import { Select, Table, TableProps, Tag } from 'antd';

const ProviderIngredientsContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { orders, cities } = useTypedSelector((state) => state.adminPanel);

  useEffect(() => {
    dispatch(fetchProviderOrders());
  }, [dispatch]);

  const columns: TableProps<IOrder>['columns'] = [
    {
      title: 'Почта',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text,
    },
    {
      title: 'Город',
      dataIndex: 'city_id',
      key: 'city_id',
      render: (city_id: number) => {
        const city = cities.find((item) => item.id === city_id);
        return city ? city.name : 'Неизвестно';
      },
    },
    {
      title: 'Тип оплаты',
      dataIndex: 'type_payment',
      key: 'type_payment',
      render: (type_payment: string) =>
        type_payment === 'CASH'
          ? 'Наличными'
          : type_payment === 'ONLINE'
          ? 'Онлайн'
          : 'Неизвестно',
    },
    {
      title: 'Статус',
      dataIndex: 'status_order',
      key: 'status_order',
      render: (status_order: string) => {
        let color = '';
        let text = '';

        switch (status_order) {
          case 'CREATED':
            color = 'blue';
            text = 'Заказ создан';
            break;
          case 'WAITINGPAYMENT':
            color = 'orange';
            text = 'Ожидается оплата';
            break;
          case 'DELIVERY':
            color = 'purple';
            text = 'Передано на доставку';
            break;
          case 'DELIVERED':
            color = 'green';
            text = 'Доставлено';
            break;
          default:
            color = 'default';
            text = 'Неизвестно';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Общая сумма',
      dataIndex: 'cost_order',
      key: 'cost_order',
      render: (cost_order: number) =>
        cost_order ? cost_order + ' грн' : 'Неизвестно',
    },
  ];

  return (
    <Table<IOrder> columns={columns} dataSource={orders} pagination={false} />
  );
};

export default ProviderIngredientsContent;
