import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, message } from 'antd';
import styles from './style.module.scss';
import ICity from '@/shared/interfaces/city.interface';
import IBrand from '@/shared/interfaces/brand.interface';
import IProduct from '@/shared/interfaces/product.interface';

const { Option } = Select;

interface IOption {
  id: number;
  name: string;
  price: number;
  weight: number;
}

const MenuPage = () => {
  const [cities, setCities] = useState<ICity[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [menuItems, setMenuItems] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: IOption | null;
  }>({});

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
      const response = await fetch(
        'https://eats.pp.ua/api/menu/branded_store/view'
      );
      const data = await response.json();
      setBrands(data.data || []);
    } catch (error) {
      message.error('Ошибка при получении брендов');
    }
  };

  async function fetchMenuItems() {
    try {
      const response = await fetch(
        `https://eats.pp.ua/api/menu/view?branded_store_id=${selectedBrand}`
      );
      const data = await response.json();
      setMenuItems(data.data || []);
    } catch (error) {
      message.error('Ошибка при получении меню');
    }
  }

  const handleOptionChange = (productId: number, optionId: number) => {
    const selectedOption =
      menuItems
        .find((item) => item.id === productId)
        ?.options.find((option) => option.id === optionId) || null;
    setSelectedOptions((prev) => ({ ...prev, [productId]: selectedOption }));
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
      title: 'Магазин',
      dataIndex: 'storeId',
      key: 'storeId',
      render: (text: string) => {
        const store = brands.find((store) => store.id === selectedBrand);
        return `${store?.name || 'Неизвестно'}`;
      },
    },
    {
      title: 'Опции',
      dataIndex: 'options',
      key: 'options',
      render: (_: any, record: IProduct) => (
        <Select
          placeholder="Выберите опцию"
          onChange={(value) => handleOptionChange(record.id, value)}
          style={{ width: 120 }}
        >
          {record.options.map((option) => (
            <Option key={option.id} value={option.id}>
              {option.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Детали опции',
      key: 'optionDetails',
      render: (_: any, record: IProduct) => {
        const selectedOption = selectedOptions[record.id];
        return selectedOption ? (
          <div>
            <p>Размер: {selectedOption.name}</p>
            <p>Вес: {selectedOption.weight} г</p>
            <p>Цена: {selectedOption.price} грн</p>
          </div>
        ) : (
          <span>Выберите опцию</span>
        );
      },
    },
  ];

  useEffect(() => {
    if (selectedCity) {
      setSelectedBrand(null);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedBrand) {
      fetchMenuItems();
    }
  }, [selectedBrand]);

  return (
    <div className={styles.menuContainer}>
      <h1>Меню</h1>
      <Form layout="inline" className={styles.form}>
        <Form.Item>
          <Select
            placeholder="Выберите город"
            onChange={(value) => setSelectedCity(value)}
            style={{ width: 197, marginBottom: 10 }}
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
            value={selectedBrand}
            disabled={!selectedCity}
            style={{ width: 197, marginBottom: 10 }}
          >
            {brands
              .filter((item) => item.city_id === selectedCity)
              .map((brand) => (
                <Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Название блюда"
            value={newMenuItem.name}
            onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, name: e.target.value })
            }
            style={{ marginBottom: 10 }}
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Цена"
            value={newMenuItem.price}
            onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, price: e.target.value })
            }
            style={{ marginBottom: 10 }}
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Вес (г)"
            value={newMenuItem.weight}
            type="number"
            onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, weight: e.target.value })
            }
            style={{ marginBottom: 10 }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {}}
            loading={loading}
            style={{ width: 197 }}
          >
            Добавить блюдо
          </Button>
        </Form.Item>
      </Form>

      {selectedCity && selectedBrand ? (
        <Table
          columns={columns}
          dataSource={menuItems}
          rowKey="id"
          loading={loading}
          className={styles.table}
        />
      ) : (
        <h2>Выберите город и магазин!</h2>
      )}
    </div>
  );
};

export default MenuPage;
