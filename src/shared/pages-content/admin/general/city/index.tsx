import { useState, useEffect } from 'react';
import { Form, Input, Button, Table, message } from 'antd';
import styles from './style.module.scss';

interface City {
  id: number;
  name: string;
}

const CityPageContent = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCityName, setNewCityName] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://eats.pp.ua/api/city/view');
      const data = await response.json();
      setCities(data.data);
    } catch (error) {
      message.error('Ошибка при получении городов');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async () => {
    if (!newCityName) {
      message.error('Введите название города');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://eats.pp.ua/api/city/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCityName }),
      });

      if (response.ok) {
        message.success('Город добавлен');
        fetchCities(); // Обновляем список городов после добавления
        setNewCityName(''); // Очищаем поле ввода
      } else {
        message.error('Ошибка при добавлении города');
      }
    } catch (error) {
      message.error('Ошибка при добавлении города');
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
  ];

  return (
    <div className={styles.cityContainer}>
      <h1>Города</h1>
      <Form layout="inline" className={styles.form}>
        <Form.Item>
          <Input
            placeholder="Название города"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddCity} loading={loading}>
            Добавить город
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={cities}
        rowKey="id"
        loading={loading}
        className={styles.table}
      />
    </div>
  );
};

export default CityPageContent;
