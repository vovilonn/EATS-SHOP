import { FC, useEffect } from 'react';

import OrdersOrderCard from '../order-card';

import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { getOrdersHistory } from '@/shared/store/orders/requests';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

const OrdersOrderList: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { ordersHistory } = useTypedSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrdersHistory());
  }, []);

  return (
    <section className={style.list}>
      {ordersHistory &&
        ordersHistory.map((order) => (
          <OrdersOrderCard key={order.id} {...order} />
        ))}
    </section>
  );
};

export default OrdersOrderList;
