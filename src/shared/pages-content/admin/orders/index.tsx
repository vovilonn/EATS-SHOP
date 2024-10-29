import { useState, useEffect } from 'react';
import { Table, Tag, Button } from 'antd';
// import { OrderStatus, Order } from './oreders-data'; // Импорт интерфейсов для заказов и статусов
import styles from './style.module.scss';

// Интерфейс для статусов заказов
export enum OrderStatus {
    PENDING = 'В ожидании',
    COMPLETED = 'Завершён',
    CANCELED = 'Отменён',
}

// Интерфейс для данных заказов
export interface Order {
    id: number;
    clientName: string;
    phone: string;
    address: string;
    status: OrderStatus;
    orderDate: string;
    total: number;
}

const initialOrders: Order[] = [
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
    // Добавьте другие заказы по необходимости
];

const OrdersPageContent = () => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    useEffect(() => {
        // Здесь можно загрузить заказы с сервера и установить их в состояние `orders`
    }, []);

    const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
    };

    const columns = [
        {
            title: 'ID заказа',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Имя клиента',
            dataIndex: 'clientName',
            key: 'clientName',
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
            title: 'Дата заказа',
            dataIndex: 'orderDate',
            key: 'orderDate',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: OrderStatus, record: Order) => (
                <Tag color={status === OrderStatus.COMPLETED ? 'green' : status === OrderStatus.CANCELED ? 'red' : 'blue'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Итоговая сумма',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => `${total} грн`,
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Order) => (
                <div className={styles.actionButtons}>
                    <Button
                        type="link"
                        onClick={() => handleStatusChange(record.id, OrderStatus.COMPLETED)}
                        disabled={record.status === OrderStatus.COMPLETED}
                    >
                        Завершить
                    </Button>
                    <Button
                        type="link"
                        onClick={() => handleStatusChange(record.id, OrderStatus.CANCELED)}
                        disabled={record.status === OrderStatus.CANCELED}
                    >
                        Отменить
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h1>Управление заказами</h1>
            <Table columns={columns} dataSource={orders} rowKey="id" />
        </div>
    );
};

export default OrdersPageContent;
