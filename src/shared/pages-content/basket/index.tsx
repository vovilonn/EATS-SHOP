import { FC } from 'react'
import Link from 'next/link'

import { PRODUCT_LIST } from '@/shared/mock-data'

import LoggedLayout from '@/shared/layouts/logged'
import ProductList from '@/shared/components/product-list'
import EmptyCard from '@/shared/components/empty-card'
import BasketHeader from './components/header'

import style from './style.module.scss'

const BasketPageContent: FC = () => {
  return (
    <LoggedLayout>
      <BasketHeader />

      <section className={style.section}>
        <ProductList
          products={PRODUCT_LIST}
          basket
          toggleAmountFull
          minAmount={1}
        />

        <Link className={style.btn} href='/profile/basket/order-confirm'>
          <span className={style.total}>Загалом: 595 грн</span>
          <span className={style.title}>Оплатити</span>
        </Link>

        <EmptyCard
          title='Ваш корзина порожня 😯'
          text='Оберіть товар, щоб додати його в корзину'
        />
      </section>
    </LoggedLayout>
  )
}

export default BasketPageContent
