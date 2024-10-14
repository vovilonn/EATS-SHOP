import { FC } from 'react';

import LoggedLayout from '@/shared/layouts/logged';
import OrdersHeader from './components/header';
import OrdersOrderList from './components/order-list';

const OrdersPageContent: FC = () => {
  return (
    <LoggedLayout>
      <OrdersHeader />

      <section>
        <OrdersOrderList />
      </section>
    </LoggedLayout>
  );
};

export default OrdersPageContent;
