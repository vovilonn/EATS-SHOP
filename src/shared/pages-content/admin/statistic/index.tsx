import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from '@ant-design/icons';
import styles from './style.module.scss';

const StatisticPageContent = () => {
  const [clientCount, setClientCount] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [activePromocodes, setActivePromocodes] = useState<number>(0);
  const [salesData, setSalesData] = useState<number[]>([
    100, 200, 150, 300, 250,
  ]);

  useEffect(() => {
    // Здесь можно сделать запросы к API для получения реальных данных
    setClientCount(1500); // Количество клиентов
    setOrderCount(125); // Количество активных заказов
    setActivePromocodes(5); // Количество активных промокодов
    // Установим salesData после получения данных о продажах
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Главная страница</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Клиенты"
              value={clientCount}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Активные заказы"
              value={orderCount}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Активные промокоды"
              value={activePromocodes}
              prefix={<TagOutlined />}
            />
          </Card>
        </Col>
      </Row>
      {/* Блок с диаграммой продаж */}
      <div className={styles.salesChart}>
        <h2>Продажи за последние 5 дней</h2>
        {/* Добавьте компонент для диаграммы, например, <LineChart data={salesData} /> */}
        {/* Или любой другой график */}
      </div>
    </div>
  );
};

export default StatisticPageContent;
