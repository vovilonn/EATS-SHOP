import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged';
import OrderConfirmHeader from './components/header';
import OrderConfirmForm from './components/form';

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
