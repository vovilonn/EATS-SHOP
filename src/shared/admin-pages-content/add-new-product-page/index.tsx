import { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import {
  fetchBrands,
  fetchCities,
  fetchProducts,
} from '@/shared/store/admin/requests';

import IProduct from '@/shared/interfaces/product.interface';

import { Form, Input, Select, Button, Table } from 'antd';

import styles from './style.module.scss';

const { Option } = Select;

interface IOption {
  id: number;
  name: string;
  price: number;
  weight: number;
}

const AddNewProductPageContent = () => {
  const dispatch = useDispatch<TypeDispatch>();

  const { cities, brands, products } = useTypedSelector(
    (state) => state.adminPanel
  );

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
    dispatch(fetchCities());
    dispatch(fetchBrands());
  }, []);

  const handleOptionChange = (productId: number, optionId: number) => {
    const selectedOption =
      products
        .find((item) => item.id === productId)
        ?.options.find((option) => option.id === optionId) || null;
    setSelectedOptions((prev) => ({ ...prev, [productId]: selectedOption }));
  };

  useEffect(() => {
    if (selectedCity) {
      setSelectedBrand(null);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedBrand) {
      setSelectedOptions({});
      dispatch(fetchProducts(selectedBrand));
    }
  }, [selectedBrand]);

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
      render: () => {
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
          dataSource={products}
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

export default AddNewProductPageContent;
