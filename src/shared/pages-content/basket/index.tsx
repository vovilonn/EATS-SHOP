import { FC } from 'react';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import Link from 'next/link';

// import { PRODUCT_LIST } from '@/shared/mock-data';

import LoggedLayout from '@/shared/layouts/logged';
import ProductList from '@/shared/components/product-list';
import BasketHeader from './components/header';

import style from './style.module.scss';

const BasketPageContent: FC = () => {
  const { total_cost } = useTypedSelector((state) => state.cart);

  return (
    <LoggedLayout>
      <BasketHeader />

      <section className={style.section}>
        <ProductList products={[]} basket toggleAmountFull minAmount={1} />
        <Link className={style.btn} href="/profile/basket/order-confirm">
          <span className={style.total}>Загалом: {total_cost} грн</span>
          <span className={style.title}>Замовити</span>
        </Link>
      </section>
    </LoggedLayout>
  );
};

export default BasketPageContent;
