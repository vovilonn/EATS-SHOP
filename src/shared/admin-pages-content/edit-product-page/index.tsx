import { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import {
  fetchBrands,
  fetchCities,
  fetchOneProduct,
  fetchProducts,
} from '@/shared/store/admin/requests';

import IBrand from '@/shared/interfaces/brand.interface';

import { Form, Select, Input, Button } from 'antd';

import styles from './style.module.scss';

const { Option } = Select;

const EditProductPageContent = () => {
  const dispatch = useDispatch<TypeDispatch>();

  const { cities, brands, products, oneProduct } = useTypedSelector(
    (state) => state.adminPanel
  );

  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
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
    dispatch(fetchCities());
    dispatch(fetchBrands());
  }, []);

  useEffect(() => {
    if (selectedCity) {
      // Очищаем выбор магазина и товара при смене города
      setSelectedBrand(null);
      setSelectedProductId(null);
      // setProducts([]);
      setSelectedOptionId(null);
      setProductDetails({
        price: '',
        weight: '',
        composition: '',
      });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedBrand) {
      dispatch(fetchProducts(selectedBrand));
      // Очищаем выбор товара при смене магазина
      setSelectedProductId(null);
      setSelectedOptionId(null);
      setProductDetails({
        price: '',
        weight: '',
        composition: '',
      });
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedProductId) {
      dispatch(fetchOneProduct(selectedProductId));

      setSelectedOptionId(null);
      setProductDetails({
        price: '',
        weight: '',
        composition: '',
      });
    }
  }, [selectedProductId]);

  useEffect(() => {
    if (oneProduct) {
      const option = oneProduct.options.filter(
        (item) => item.id === selectedOptionId
      );

      if (option) {
        setProductDetails({
          price: `${option[0]?.price}` || '',
          weight: `${option[0]?.weight}` || '',
          composition: oneProduct?.composition || '',
        });
      }
    }
  }, [selectedOptionId, oneProduct]);

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
            onChange={(value) => setSelectedBrand(value)}
            value={selectedBrand}
            disabled={!selectedCity}
            loading={loading}
          >
            {brands
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
            disabled={!selectedBrand}
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

export default EditProductPageContent;
