import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import styles from './style.module.scss';

interface Product {
  id: number;
  name: string;
  price: number;
}

const ProductEditPageContent = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    const mockProduct = {
      id: Number(productId),
      name: `Товар ${productId}`,
      price: 100 + Number(productId) * 10,
    };
    setProduct(mockProduct);
    setLoading(false);
  };

  const handleSave = (values: Product) => {
    message.success('Изменения сохранены!');
    router.push('/admin');
  };

  return (
    <div className={styles.editContainer}>
      <div className={styles.editProductTitle}>Редактирование товара {id}</div>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <Form
          initialValues={product}
          onFinish={handleSave}
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            label="Название товара"
            name="name"
            rules={[{ required: true, message: 'Введите название товара' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Цена товара"
            name="price"
            rules={[{ required: true, message: 'Введите цену товара' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form>
      )}
    </div>
  );
};

export default ProductEditPageContent;
