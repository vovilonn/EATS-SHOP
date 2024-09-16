import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'

import BasketIcon from '@/shared/assets/icons/basket-icon.svg'

import style from './style.module.scss'

const BasketHeader: FC = () => {
  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack href='/' />
        <BreadcrumbGeneral icon={BasketIcon} name='Корзина' href='/' />
      </Breadcrumbs>
    </header>
  )
}

export default BasketHeader
