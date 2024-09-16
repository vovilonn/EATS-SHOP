import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'
import BreadcrumbName from '@/shared/components/ui/breadcrumbs/components/breadcrumb-name'

import BasketIcon from '@/shared/assets/icons/basket-icon.svg'
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg'

import style from './style.module.scss'

const SelectInstitutionHeader: FC = () => {
  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack href='/' />
        <BreadcrumbGeneral icon={BasketIcon} name='Корзина' href='/' />
        <ArrowRightIcon />
        <BreadcrumbName name='Підтвердження замовлення' />
        <ArrowRightIcon />
        <BreadcrumbName name='Обрати заклад' />
      </Breadcrumbs>
    </header>
  )
}

export default SelectInstitutionHeader
