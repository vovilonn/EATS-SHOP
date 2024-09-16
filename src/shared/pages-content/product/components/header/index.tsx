import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'
import BreadcrumbName from '@/shared/components/ui/breadcrumbs/components/breadcrumb-name'
import BreadcrumbCategory from '@/shared/components/ui/breadcrumbs/components/breadcrumb-category'

import MenuIcon from '@/shared/assets/icons/menu-icon.svg'
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg'

import style from './style.module.scss'

const ProductHeader: FC = () => {
  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack href='/' />
        <BreadcrumbGeneral icon={MenuIcon} name='Меню' href='/' />
        <ArrowRightIcon />
        <BreadcrumbCategory
          icon='https://s3.eu-north-1.amazonaws.com/eats.app/general_categories/pizza.png'
          name='Піца'
          href='/'
        />
        <ArrowRightIcon />
        <BreadcrumbName name='Італійська вегетаріана' />
      </Breadcrumbs>
    </header>
  )
}

export default ProductHeader
