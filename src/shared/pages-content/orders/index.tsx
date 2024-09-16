import { FC } from 'react'

import { ORDER_LIST } from '@/shared/mock-data'

import LoggedLayout from '@/shared/layouts/logged'
import OrdersHeader from './components/header'
import OrdersOrderList from './components/order-list'

const OrdersPageContent: FC = () => {
  return (
    <LoggedLayout>
      <OrdersHeader />

      <section>
        <OrdersOrderList orders={ORDER_LIST} />
      </section>
    </LoggedLayout>
  )
}

export default OrdersPageContent
