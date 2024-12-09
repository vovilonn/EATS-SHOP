import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'

import BasketIcon from '@/shared/assets/icons/basket-icon.svg'

import style from './style.module.scss'
import {useRouter} from "next/router";

const BasketHeader: FC = () => {
  const { back } = useRouter();

  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack onClick={back} />
        <BreadcrumbGeneral icon={BasketIcon} name='Корзина' href='/profile/basket' />
      </Breadcrumbs>
    </header>
  )
}

export default BasketHeader
