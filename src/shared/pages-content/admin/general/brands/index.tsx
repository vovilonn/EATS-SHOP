import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, message } from 'antd';
import styles from './style.module.scss';

interface Store {
  id: number;
  name: string;
  cityId: number;
}

interface City {
  id: number;
  name: string;
}

const { Option } = Select;

const BrandsPageContent = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  useEffect(() => {
    fetchCities();
    fetchStores();
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
      setStores(data.data);
    } catch (error) {
      message.error('Ошибка при получении магазинов');
    }
  };

  const handleAddStore = async () => {
    if (!newStoreName || !selectedCity) {
      message.error('Введите название магазина и выберите город');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://eats.pp.ua/api/store/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newStoreName, cityId: selectedCity }),
      });

      if (response.ok) {
        message.success('Магазин добавлен');
        fetchStores(); // Обновляем список магазинов
        setNewStoreName(''); // Очищаем поле ввода
        setSelectedCity(null); // Очищаем выбор города
      } else {
        message.error('Ошибка при добавлении магазина');
      }
    } catch (error) {
      message.error('Ошибка при добавлении магазина');
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
      title: 'Город',
      dataIndex: 'cityId',
      key: 'cityId',
      render: (cityId: number) => cities.find((city) => city.id === cityId)?.name || 'Неизвестно',
    },
  ];

  return (
    <div className={styles.storeContainer}>
      <h1>Магазины</h1>
      <Form layout="inline" className={styles.form}>
        <Form.Item>
          <Input
            placeholder="Название магазина"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Select
            placeholder="Выберите город"
            onChange={(value) => setSelectedCity(value)}
            value={selectedCity}
            style={{ width: 200 }}
          >
            {cities.map((city) => (
              <Option key={city.id} value={city.id}>
                {city.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddStore} loading={loading}>
            Добавить магазин
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={stores}
        rowKey="id"
        loading={loading}
        className={styles.table}
      />
    </div>
  );
};

export default BrandsPageContent;
