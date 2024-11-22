import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import { IOrdersHistory } from '@/shared/interfaces/order.interface';

import { fetchProviderOrders } from '@/shared/store/admin/provider/requests';

import { Card, Modal, Table, TableProps, Tag } from 'antd';
import { IModelMenuIngredientsCart } from '@/shared/interfaces/cart-item.interface';
import { formatDate } from '@/shared/utils/formatDate';

const ProviderIngredientsContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { orders, cities } = useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IOrdersHistory | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchProviderOrders());
  }, [dispatch]);

  const columns: TableProps<IOrdersHistory>['columns'] = [
    {
      title: 'Пошта',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => record.model_account.email,
    },
    {
      title: 'Місто',
      dataIndex: 'city_id',
      key: 'city_id',
      render: (city_id: number) => {
        const city = cities.find((item) => item.id === city_id);
        return city ? city.name : 'Невідомо';
      },
    },
    {
      title: 'Тип оплати',
      dataIndex: 'type_payment',
      key: 'type_payment',
      render: (type_payment: string) =>
        type_payment === 'CASH'
          ? 'Готівкою'
          : type_payment === 'ONLINE'
          ? 'Онлайн'
          : 'Невідомо',
    },
    {
      title: 'Статус',
      dataIndex: 'status_order',
      key: 'status_order',
      render: (status_order: string) => {
        const { color, text } = checkOrderStatus(status_order);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Загальна сума',
      dataIndex: 'cost_order',
      key: 'cost_order',
      render: (_, record: IOrdersHistory) =>
        record.cost_total_order ? record.cost_total_order + ' грн' : 'Невідомо',
    },
  ];

  const handleRowClick = (record: IOrdersHistory) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const totalSumIngredients = (
    ingredients: IModelMenuIngredientsCart[]
  ): number => {
    return ingredients.reduce((total, item) => {
      const ingredientPrice = item.model_menu_ingredients.price;
      const ingredientCount = item.count;
      return total + ingredientPrice * ingredientCount;
    }, 0);
  };

  const checkOrderStatus = (status_order: string) => {
    let color = '';
    let text = '';

    switch (status_order) {
      case 'CREATED':
        color = 'blue';
        text = 'Замовлення створено';
        break;
      case 'WAITINGPAYMENT':
        color = 'orange';
        text = 'Очікується оплата';
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
        text = 'Невідомо';
    }

    return { color, text };
  };

  return (
    <>
      <Table<IOrdersHistory>
        columns={columns}
        dataSource={orders}
        pagination={false}
        onRow={(record: IOrdersHistory) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        width={'65%'}
        title={`Номер заказа: №${selectedRecord?.id}`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p style={{ color: 'gray', fontSize: '12px' }}>
              {formatDate(selectedRecord.createdAt)}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '30px',
              }}
            >
              <div>
                <p>
                  Ім'я:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.model_account.name}
                  </span>
                </p>
                <p>
                  Пошта:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.model_account.email || 'Неизвестно'}
                  </span>
                </p>
                <p>
                  Номер телефону:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.model_account.number || 'Неизвестно'}
                  </span>
                </p>
                <p>
                  Адрес:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.address}
                  </span>
                </p>
                <p>
                  Під'їзд:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.entrance}
                  </span>
                </p>
                <p>
                  Поверх:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.floor}
                  </span>
                </p>
                <p>
                  № Квартири:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.apartment}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  Місто:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.model_account.model_city.name}
                  </span>
                </p>
                <p>
                  Коментар:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.comment || 'Пусто'}
                  </span>
                </p>
                <p>
                  Спосіб оплати:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.type_payment === 'CASH'
                      ? 'Готівкою'
                      : selectedRecord.type_payment === 'ONLINE'
                      ? 'Онлайн'
                      : 'Невідомо'}
                  </span>
                </p>
                <p>
                  Eats Coins:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.count_eats_coin || 0}
                  </span>
                </p>
                <p>
                  Знижка з промокодом:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.discount_promo_code
                      ? selectedRecord.discount_promo_code + '%'
                      : '0%'}
                  </span>
                </p>
                <p>
                  Сторінка оплати:{' '}
                  <a href={selectedRecord.payment_url} target="_blank">
                    Перейти
                  </a>
                </p>
                <p>
                  Статус:{' '}
                  <span
                    style={{
                      color: `${
                        checkOrderStatus(selectedRecord.status_order).color
                      }`,
                      fontStyle: 'italic',
                    }}
                  >
                    {checkOrderStatus(selectedRecord.status_order).text}
                  </span>
                </p>
              </div>
            </div>

            <div
              style={{
                margin: '20px 0',
                display: 'grid',
                gap: '20px',
                justifyContent: 'center',
                gridTemplateColumns:
                  selectedRecord.cart.cart_items.length === 1
                    ? 'minmax(450px, 450px)'
                    : 'repeat(2, minmax(300px, 1fr))',
              }}
            >
              {selectedRecord.cart.cart_items.map((item) => (
                <Card
                  title={
                    <p style={{ fontWeight: 'bold' }}>{item.model_menu.name}</p>
                  }
                  extra={
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.model_options.price} грн
                    </span>
                  }
                >
                  <div
                    style={{
                      textAlign: 'center',
                      borderBottom: '1px solid black',
                      paddingBottom: '15px',
                    }}
                  >
                    <p>
                      Заклад:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {item.model_menu.model_branded_store?.name}
                      </span>
                    </p>
                    <p>
                      Кількість:{' '}
                      <span style={{ fontWeight: 'bold' }}>{item.count}</span>
                    </p>
                    <p>
                      Основна категорія:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {item.model_menu.model_general_categories?.name}
                      </span>
                    </p>
                    <p>
                      Категорія Закладу:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {item.model_menu.model_branded_store_categories?.name}
                      </span>
                    </p>
                    <p>
                      Розмір:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {item.model_options.name}
                      </span>
                    </p>
                    <p>
                      Вага:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {item.model_options.weight} гр
                      </span>
                    </p>
                    <p style={{ fontWeight: 'bold' }}>Добавки</p>
                    {item.model_menu_ingredients_cart.length !== 0 ? (
                      <>
                        <ul>
                          {item.model_menu_ingredients_cart.map((item) => (
                            <li>
                              {item.model_menu_ingredients.name}{' '}
                              {`(${item.model_menu_ingredients.options}) - ${item.count} шт - ${item.model_menu_ingredients.price} грн`}
                            </li>
                          ))}
                        </ul>
                        <p style={{ fontWeight: 'bold' }}>
                          Загальна сума Добавок:{' '}
                          {totalSumIngredients(
                            item.model_menu_ingredients_cart
                          )}
                        </p>
                      </>
                    ) : (
                      <p style={{ color: 'gray' }}>Добавок немає</p>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '15px',
                    }}
                  >
                    <p>ВСЕГО</p>
                    <p>{item.item_cost} грн</p>
                  </div>
                </Card>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                Всего: <span>{selectedRecord.cost_total_order} грн</span>
              </p>
              <p style={{ color: 'gray', fontSize: '12px' }}>
                Сума з урахуванням усіх доступних знижок
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProviderIngredientsContent;
