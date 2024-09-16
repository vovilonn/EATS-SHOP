import { FC } from 'react'

import IOrder from '@/shared/interfaces/order.interface'

import OrdersOrderCard from '../order-card'

import style from './style.module.scss'

interface IOrdersOrderListProps {
  orders: Array<IOrder>
}

const OrdersOrderList: FC<IOrdersOrderListProps> = props => {
  const orderListRendering = props.orders.map(order => {
    const key = Math.random()

    return <OrdersOrderCard key={key} {...order} />
  })

  return <section className={style.list}>{orderListRendering}</section>
}

export default OrdersOrderList
