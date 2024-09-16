import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import OrderConfirmHeader from './componetns/header'
import OrderConfirmForm from './componetns/form'

const OrderConfirmPageContent: FC = () => {
  return (
    <LoggedLayout>
      <OrderConfirmHeader />

      <section>
        <OrderConfirmForm />
      </section>
    </LoggedLayout>
  )
}

export default OrderConfirmPageContent
