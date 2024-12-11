import { FC } from 'react';

import LoggedLayout from '@/shared/layouts/logged';
import OrderConfirmHeader from './components/header';
import OrderConfirmForm from './components/form';
import ProductList from '@/shared/components/product-list';

const OrderConfirmPageContent: FC = () => {
  return (
    <LoggedLayout>
      <OrderConfirmHeader />
      <ProductList products={[]} basket toggleAmountFull minAmount={1} />
      <section style={{ marginTop: '60px' }}>
        <OrderConfirmForm />
      </section>
    </LoggedLayout>
  );
};

export default OrderConfirmPageContent;
