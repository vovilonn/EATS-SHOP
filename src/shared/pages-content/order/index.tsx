import { FC } from 'react'

import { PRODUCT_LIST } from '@/shared/mock-data'

import IOrder from '@/shared/interfaces/order.interface'

import Button from '@/shared/components/ui/button'
import LoggedLayout from '@/shared/layouts/logged'
import OrderHeader from './components/header'
import OrderProductCard from './components/product-card'

import style from './style.module.scss'

// interface IOrderPageContentProps extends IOrder {}
interface IOrderPageContentProps {}

const OrderPageContent: FC<IOrderPageContentProps> = props => {
  const classNameStatus: string = `${style.status} ${style.delivered}`

  const productListRendering = PRODUCT_LIST.map(product => {
    const key = Math.random()

    return <OrderProductCard key={key} {...product} />
  })

  return (
    <LoggedLayout>
      <OrderHeader />

      <section className={style.wraper}>
        <article className={style.order}>
          <header className={style.header}>
            <div className={style.row}>
              <p className={style.date}>черв. 08, 2024 18:12</p>
              <p className={classNameStatus}>Доставлено</p>
            </div>
            <div className={style.address}>
              <p className={style.label}>Адреса доставки</p>
              <p className={style.text}>м. Ужгород, вул Минайська 7а</p>
            </div>
            <div className={style.row}>
              <p className={style.total}>Сума:</p>
              <p className={style.total}>495 грн</p>
            </div>
            <div className={style.row}>
              <p className={style.payment}>Спосіб оплати:</p>
              <p className={style.payment}>Готівка</p>
            </div>
          </header>
          <footer className={style.products}>{productListRendering}</footer>
        </article>
        <Button className={style.btn} basket>
          Повторити
        </Button>
      </section>
    </LoggedLayout>
  )
}

export default OrderPageContent
