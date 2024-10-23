import { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message } from 'antd';
import styles from './style.module.scss';

const { Option } = Select;

const AdminPageContent = () => {
  const [cities, setCities] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productDetails, setProductDetails] = useState({
    price: '',
    weight: '',
    composition: '',
  });

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchStores();
      // Очищаем выбор магазина и товара при смене города
      setSelectedStore(null);
      setSelectedProduct(null);
      setProducts([]);
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
      setSelectedProduct(null);
      setProductDetails({
        price: '',
        weight: '',
        composition: '',
      });
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductDetails(selectedProduct);
    }
  }, [selectedProduct]);

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
      const response = await fetch('https://eats.pp.ua/api/menu/general_categories/view');
      const data = await response.json();
      setStores(data.data);
    } catch (error) {
      message.error('Ошибка при получении магазинов');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://eats.pp.ua/api/menu/view?page=1');
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      message.error('Ошибка при получении товаров');
    }
  };

  const fetchProductDetails = async (productId: number) => {
    try {
      const response = await fetch(`https://eats.pp.ua/api/product/${productId}`);
      const data = await response.json();
      const product = data.data;
      // Предзаполняем поля данными о товаре
      setProductDetails({
        price: product.price || '',
        weight: product.weight || '',
        composition: product.composition || '',
      });
    } catch (error) {
      message.error('Ошибка при получении данных о товаре');
    }
  };

  const handleProductDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            {cities && cities.map((city: any) => (
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
            {stores.map((store: any) => (
              <Option key={store.id} value={store.id}>
                {store.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Товар">
          <Select
            placeholder="Выберите товар"
            onChange={(value) => setSelectedProduct(value)}
            value={selectedProduct}
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

        {selectedProduct && (
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
