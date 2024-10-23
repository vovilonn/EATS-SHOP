import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, message } from 'antd';
import styles from './style.module.scss';

interface Store {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  weight: string;
  storeId: number;
}

interface City {
  id: number;
  name: string;
}

const { Option } = Select;

const MenuPage = () => {
  const [stores, setStores] = useState<Store[]>([]); // Инициализируем как пустой массив
  const [cities, setCities] = useState<City[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    weight: '',
    storeId: null as number | null,
  });

  useEffect(() => {
    fetchCities();
    fetchStores();
    fetchMenuItems();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('https://eats.pp.ua/api/city/view');
      const data = await response.json();
      setCities(data.data);
    } catch (error) {
      message.error('Ошибка при получении городов');
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('https://eats.pp.ua/api/store/view'); // Примерный endpoint для магазинов
      const data = await response.json();
      setStores(data.data || []); // Защита от undefined
    } catch (error) {
      message.error('Ошибка при получении магазинов');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('https://eats.pp.ua/api/menu/view?page=1'); // Примерный endpoint для меню
      const data = await response.json();
      setMenuItems(data.data || []); // Защита от undefined
    } catch (error) {
      message.error('Ошибка при получении меню');
    }
  };

  const handleAddMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.weight || !newMenuItem.storeId) {
      message.error('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://eats.pp.ua/api/menu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMenuItem.name,
          price: newMenuItem.price,
          weight: newMenuItem.weight,
          storeId: newMenuItem.storeId,
        }),
      });

      if (response.ok) {
        message.success('Блюдо добавлено в меню');
        fetchMenuItems(); // Обновляем список блюд
        setNewMenuItem({ name: '', price: '', weight: '', storeId: null }); // Очищаем поля ввода
      } else {
        message.error('Ошибка при добавлении блюда');
      }
    } catch (error) {
      message.error('Ошибка при добавлении блюда');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Вес',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Магазин',
      dataIndex: 'storeId',
      key: 'storeId',
      render: (storeId: number) => stores.find((store) => store.id === storeId)?.name || 'Неизвестно',
    },
  ];

  return (
    <div className={styles.menuContainer}>
      <h1>Меню</h1>
      <Form layout="inline" className={styles.form}>
        <Form.Item>
          <Input
            placeholder="Название блюда"
            value={newMenuItem.name}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Цена"
            value={newMenuItem.price}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Вес"
            value={newMenuItem.weight}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, weight: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Select
            placeholder="Выберите магазин"
            onChange={(value) => setNewMenuItem({ ...newMenuItem, storeId: value })}
            value={newMenuItem.storeId}
            style={{ width: 200 }}
          >
            {stores.length > 0
              ? stores.map((store) => (
                  <Option key={store.id} value={store.id}>
                    {store.name}
                  </Option>
                ))
              : <Option disabled>Нет доступных магазинов</Option>}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddMenuItem} loading={loading}>
            Добавить блюдо
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={menuItems}
        rowKey="id"
        loading={loading}
        className={styles.table}
      />
    </div>
  );
};

export default MenuPage;
