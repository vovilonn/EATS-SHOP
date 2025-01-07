import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import {
  editOrderStatus,
  fetchProviderOrders,
} from '@/shared/store/admin/provider/requests';

import {
  IOrdersHistory,
  StatusOrder,
} from '@/shared/interfaces/order.interface';
import { IModelMenuIngredientsCart } from '@/shared/interfaces/cart-item.interface';

import { formatDate } from '@/shared/utils/formatDate';

import {
  Button,
  Card,
  message,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
} from 'antd';
import {useActions} from "@/shared/hooks/use-actions";

const { Option } = Select;

const editableStatuses = ['NEWORDER', 'PROGRESS', 'DELIVERY', 'DELIVERED'];

const statusPriority: Record<StatusOrder, number> = {
  NEWORDER: 1,
  PROGRESS: 2,
  DELIVERY: 3,
  WAITINGPAYMENT: 4,
  DELIVERED: 5,
  CANCELED: 6,
};

const ProviderIngredientsContent: React.FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const actions = useActions();
  const { orders, isSoundPlayed } = useTypedSelector((state) => state.adminPanel);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IOrdersHistory | null>(
    null
  );
  const [showCanceled, setShowCanceled] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);

  const columns: TableProps<IOrdersHistory>['columns'] = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      render: (_, record) => record.id,
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => record.model_account.name,
    },
    {
      title: 'Номер телефона',
      dataIndex: 'number',
      key: 'number',
      render: (_, record) => record.model_account.number,
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
    setCurrentStatus(record.status_order);
    setIsModalOpen(true);
    actions.isSoundPlayedChanged(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentStatus(null);
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

  const checkOrderStatus = (status: string) => {
    let color = '';
    let text = '';

    switch (status) {
      case 'NEWORDER':
        color = 'green';
        text = 'Нове замовлення';
        break;
      case 'WAITINGPAYMENT':
        color = 'orange';
        text = 'Очікується оплата';
        break;
      case 'PROGRESS':
        color = 'blue';
        text = 'Замовлення виконується';
        break;
      case 'DELIVERY':
        color = 'purple';
        text = 'Передано на доставку';
        break;
      case 'DELIVERED':
        color = 'gray';
        text = 'Доставлено';
        break;
      case 'CANCELED':
        color = 'default';
        text = 'Замовлення скасовано';
        break;
      default:
        color = 'default';
        text = 'Невідомо';
    }

    return { color, text };
  };

  const handleStatusChange = async (newStatus: string) => {
    if (selectedRecord) {
      try {
        await dispatch(
          editOrderStatus({ order_id: selectedRecord.id, status: newStatus })
        );
        // setCurrentStatus(newStatus);
        setIsModalOpen(false);

        await dispatch(fetchProviderOrders());

        message.success(
          `Статус замовлення змінено на "${checkOrderStatus(newStatus).text}"`
        );
      } catch (error) {
        message.error('Щось пішло не так!');
      }
    }
  };

  const filterOrders = (orders: IOrdersHistory[], open: boolean) => {
    let filteredOrders = [...orders].sort((a, b): number => {
      const statusDiff =
        statusPriority[a.status_order] - statusPriority[b.status_order];
      return statusDiff;
    });

    if (!open) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status_order !== 'CANCELED'
      );
    }

    return filteredOrders;
  };

  return (
    <>
      <Table<IOrdersHistory>
        columns={columns}
        dataSource={filterOrders(orders, showCanceled)}
        pagination={false}
        onRow={(record: IOrdersHistory) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
        rowKey="id"
      />

      <div
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      >
        <Button type="primary" onClick={() => setShowCanceled(!showCanceled)}>
          {!showCanceled ? 'Показати скасовані' : 'Приховати'}
        </Button>
      </div>

      <Modal
        width={'65%'}
        title={`Номер замовлення: №${selectedRecord?.id}`}
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
              <div style={{ width: '60%' }}>
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
                    {typeof selectedRecord.address === 'string'
                      ? selectedRecord.address
                      : selectedRecord.address.formatted_address}
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
                      ? selectedRecord.discount_promo_code + ' грн'
                      : '0 грн'}
                  </span>
                </p>
                <p>
                  Доставка:{' '}
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                    {selectedRecord.cost_delivery
                      ? selectedRecord.cost_delivery + ' грн'
                      : '0 грн'}
                  </span>
                </p>
                <div>
                  <p>
                    <strong>Поточний статус:</strong>{' '}
                    <span
                      style={{
                        color: checkOrderStatus(selectedRecord.status_order)
                          .color,
                      }}
                    >
                      {checkOrderStatus(selectedRecord.status_order).text}
                    </span>
                  </p>

                  {editableStatuses.includes(currentStatus!) ? (
                    <>
                      <Select
                        value="Змінити статус"
                        style={{ width: '100%' }}
                        onChange={handleStatusChange}
                      >
                        {editableStatuses
                          .filter((status) => status !== currentStatus)
                          .map((status) => (
                            <Option key={status} value={status}>
                              {checkOrderStatus(status).text}
                            </Option>
                          ))}
                      </Select>
                    </>
                  ) : (
                    <p style={{ color: 'gray', fontSize: '12px' }}>
                      Зміна статусу недоступна для цього замовлення.
                    </p>
                  )}
                </div>
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
