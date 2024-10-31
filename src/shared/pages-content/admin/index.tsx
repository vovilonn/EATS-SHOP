import { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message } from 'antd';
import styles from './style.module.scss';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { getCities } from '@/shared/store/city/requests';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import IBrand from '@/shared/interfaces/brand.interface';
import IProduct from '@/shared/interfaces/product.interface';

const { Option } = Select;

const AdminPageContent = () => {
  const dispatch = useDispatch<TypeDispatch>();

  const { cities } = useTypedSelector((state) => state.city);

  const [stores, setStores] = useState<IBrand[] | []>([]);
  const [products, setProducts] = useState<IProduct[] | []>([]);
  const [oneProduct, setOneProduct] = useState<IProduct | null>();
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [productDetails, setProductDetails] = useState({
    price: '',
    weight: '',
    composition: '',
  });

  useEffect(() => {
    dispatch(getCities());
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      // Очищаем выбор магазина и товара при смене города
      setSelectedStore(null);
      setSelectedProductId(null);
      setProducts([]);
      setSelectedOptionId(null);
      setProductDetails({
        price: '',
        weight: '',
        composition: '',
      });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedStore) {
      fetchProducts();
      // Очищаем выбор товара при смене магазина
      setSelectedProductId(null);
      setSelectedOptionId(null);
      setProductDetails({
        price: '',
        weight: '',
        composition: '',
      });
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedProductId) {
      fetchProductDetails();
    }
  }, [selectedProductId]);

  useEffect(() => {
    if (oneProduct) {
      const option = oneProduct.options.filter(
        (item) => item.id === selectedOptionId
      );

      setProductDetails({
        price: `${option[0].price}` || '',
        weight: `${option[0].weight}` || '',
        composition: oneProduct.composition || '',
      });
    }
  }, [selectedOptionId]);

  const fetchStores = async () => {
    try {
      const response = await fetch(
        'https://eats.pp.ua/api/menu/branded_store/view'
      );
      const data = await response.json();
      setStores(data.data);
    } catch (error) {
      message.error('Ошибка при получении магазинов');
    }
  };

  const fetchProducts = async () => {
    try {
      if (selectedStore) {
        const response = await fetch(
          `https://eats.pp.ua/api/menu/view?branded_store_id=${selectedStore}`
        );
        const data = await response.json();
        setProducts(data.data);
      } else {
        message.warning('Нужно обязательно выбрать магазин!');
      }
    } catch (error) {
      message.error('Ошибка при получении товаров');
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(
        `https://eats.pp.ua/api/menu/view?menu_id=${selectedProductId}`
      );
      const { data } = await response.json();
      setOneProduct(data[0]);
    } catch (error) {
      message.error('Ошибка при получении данных о товаре');
    }
  };

  const handleProductDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProduct = () => {
    console.log('Сохранение данных товара:', productDetails);
    // Здесь можно отправить данные на сервер для сохранения
  };

  return (
    <div className={styles.generalContainer}>
      <h1>Редактирование товара</h1>
      <Form layout="vertical">
        <Form.Item label="Город">
          <Select
            placeholder="Выберите город"
            onChange={(value) => setSelectedCity(value)}
            value={selectedCity}
            loading={loading}
          >
            {cities &&
              cities.map((city: any) => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Магазин">
          <Select
            placeholder="Выберите магазин"
            onChange={(value) => setSelectedStore(value)}
            value={selectedStore}
            disabled={!selectedCity}
            loading={loading}
          >
            {stores
              .filter((brand) => brand.city_id === selectedCity)
              .map((store: IBrand) => (
                <Option key={store.id} value={store.id}>
                  {store.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Товар">
          <Select
            placeholder="Выберите товар"
            onChange={(value) => setSelectedProductId(value)}
            value={selectedProductId}
            disabled={!selectedStore}
            loading={loading}
          >
            {products.map((product: any) => (
              <Option key={product.id} value={product.id}>
                {product.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedProductId && (
          <Form.Item label="Размер товара">
            <Select
              placeholder="Выберите размер товар"
              onChange={(value) => setSelectedOptionId(value)}
              value={selectedOptionId}
              disabled={!selectedProductId}
              loading={loading}
            >
              {products
                .filter((product) => product.id === selectedProductId)[0]
                .options.map((option: any) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        )}

        {selectedOptionId && (
          <>
            <Form.Item label="Цена">
              <Input
                name="price"
                placeholder="Введите цену"
                value={productDetails.price}
                onChange={handleProductDetailsChange}
              />
            </Form.Item>

            <Form.Item label="Вес">
              <Input
                name="weight"
                placeholder="Введите вес"
                value={productDetails.weight}
                onChange={handleProductDetailsChange}
              />
            </Form.Item>

            <Form.Item label="Состав">
              <Input
                name="composition"
                placeholder="Введите состав"
                value={productDetails.composition}
                onChange={handleProductDetailsChange}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleSaveProduct}>
                Сохранить
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default AdminPageContent;
