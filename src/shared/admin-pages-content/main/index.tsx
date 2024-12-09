import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { TypeDispatch } from '@/shared/store';

import {
  fetchAllClients,
  fetchAllPromocodes,
} from '@/shared/store/admin/requests';
import { fetchProviderOrders } from '@/shared/store/admin/provider/requests';

import MainPageProviderContent from './main-page-provider';

import { Row, Col, Card, Statistic } from 'antd';

import {
  UserOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from '@ant-design/icons';

import styles from './style.module.scss';

const MainPageContent = () => {
  const dispatch = useDispatch<TypeDispatch>();

  const { role, clients, orders, promocodes } = useTypedSelector(
    (state) => state.adminPanel
  );

  useEffect(() => {
    dispatch(fetchAllClients());
    dispatch(fetchProviderOrders());
    dispatch(fetchAllPromocodes());
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>
        {role === 'PROVIDER' ? 'Мої заклади' : 'Головна сторінка'}
      </h1>
      {role === 'PROVIDER' ? (
        <MainPageProviderContent />
      ) : (
        <>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Клієнти"
                  value={clients.length}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title=" Активні замовлення"
                  value={orders.length}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Активні промокоди"
                  value={promocodes.length}
                  prefix={<TagOutlined />}
                />
              </Card>
            </Col>
          </Row>
          <div className={styles.salesChart}>
            <h2> Продажі за останні 5 днів</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default MainPageContent;
