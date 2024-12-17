import { FC, useEffect } from 'react';

import OrdersOrderCard from '../order-card';

import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { getOrdersHistory } from '@/shared/store/orders/requests';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import EmptyCard from "@/shared/components/empty-card";
import classNames from "classnames";

const OrdersOrderList: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { ordersHistory } = useTypedSelector((state) => state.orders);
  const isNotEmpty = !!ordersHistory?.length;

  useEffect(() => {
    dispatch(getOrdersHistory());
  }, []);

  return (
    <section className={classNames(style.list, isNotEmpty ? false : style.empty)}>
      {isNotEmpty
        ? ordersHistory.map((order) => (
          <OrdersOrderCard key={order.id} {...order} />
        ))
      : (
        <EmptyCard
          title="У вас немає замовлень"
          text="Замовте товар, щоб він з'явився в списку"
        />
      )}
    </section>
  );
};

export default OrdersOrderList;
