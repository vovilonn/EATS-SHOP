import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'
import BreadcrumbName from '@/shared/components/ui/breadcrumbs/components/breadcrumb-name'

import ProfileIcon from '@/shared/assets/icons/profile-icon.svg'
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg'

import style from './style.module.scss'

const OrderHeader: FC = () => {
  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack href='/' />
        <BreadcrumbGeneral icon={ProfileIcon} name='Профіль' href='/profile' />
        <ArrowRightIcon />
        <BreadcrumbName name='Замовлення' />
        <ArrowRightIcon />
        <BreadcrumbName name='Історія' />
        <ArrowRightIcon />
        <BreadcrumbName name='Замовлення №2' />
      </Breadcrumbs>
    </header>
  )
}

export default OrderHeader
