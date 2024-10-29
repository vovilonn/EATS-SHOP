import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, message } from 'antd';
import styles from './style.module.scss';

interface Store {
  id: number;
  name: string;
  cityId: number;
  brandId: number;
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

interface Brand {
  id: number;
  name: string;
}

const { Option } = Select;

const MenuPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    weight: '',
    storeId: null as number | null,
  });

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  useEffect(() => {
    fetchCities();
    fetchBrands();
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

  const fetchBrands = async () => {
    try {
      const response = await fetch('https://eats.pp.ua/api/brands/view'); // Примерный endpoint для брендов
      const data = await response.json();
      setBrands(data.data || []);
    } catch (error) {
      message.error('Ошибка при получении брендов');
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('https://eats.pp.ua/api/store/view'); // Примерный endpoint для магазинов
      const data = await response.json();
      setStores(data.data || []);
    } catch (error) {
      message.error('Ошибка при получении магазинов');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('https://eats.pp.ua/api/menu/view?page=1'); // Примерный endpoint для меню
      const data = await response.json();
      setMenuItems(data.data || []);
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
        fetchMenuItems();
        setNewMenuItem({ name: '', price: '', weight: '', storeId: null });
      } else {
        message.error('Ошибка при добавлении блюда');
      }
    } catch (error) {
      message.error('Ошибка при добавлении блюда');
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(
    (store) => (!selectedCity || store.cityId === selectedCity) &&
               (!selectedBrand || store.brandId === selectedBrand)
  );

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
      title: 'Вес (г)',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: string) => `${weight} г`,
    },
    {
      title: 'Магазин',
      dataIndex: 'storeId',
      key: 'storeId',
      render: (storeId: number) => {
        const store = stores.find((store) => store.id === storeId);
        const city = cities.find((city) => city.id === store?.cityId)?.name || 'Неизвестно';
        const brand = brands.find((brand) => brand.id === store?.brandId)?.name || 'Неизвестно';
        return `${store?.name || 'Неизвестно'} (${city}, ${brand})`;
      },
    },
  ];

  return (
    <div className={styles.menuContainer}>
      <h1>Меню</h1>
      <Form layout="inline" className={styles.form}>
        <Form.Item>
          <Select
            placeholder="Выберите город"
            onChange={(value) => setSelectedCity(value)}
            style={{ width: 150 }}
          >
            {cities.map((city) => (
              <Option key={city.id} value={city.id}>
                {city.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Select
            placeholder="Выберите бренд"
            onChange={(value) => setSelectedBrand(value)}
            style={{ width: 150 }}
          >
            {brands.map((brand) => (
              <Option key={brand.id} value={brand.id}>
                {brand.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Select
            placeholder="Выберите магазин"
            onChange={(value) => setNewMenuItem({ ...newMenuItem, storeId: value })}
            value={newMenuItem.storeId}
            style={{ width: 200 }}
          >
            {filteredStores.length > 0
              ? filteredStores.map((store) => (
                  <Option key={store.id} value={store.id}>
                    {store.name}
                  </Option>
                ))
              : <Option disabled>Нет доступных магазинов</Option>}
          </Select>
        </Form.Item>
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
            placeholder="Вес (г)"
            value={newMenuItem.weight}
            type="number"
            onChange={(e) => setNewMenuItem({ ...newMenuItem, weight: e.target.value })}
          />
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
