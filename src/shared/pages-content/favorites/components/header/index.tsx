import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'

import LikeIcon from '@/shared/assets/icons/like-icon.svg'

import style from './style.module.scss'

const FavoritesHeader: FC = () => {
  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack href='/' />
        <BreadcrumbGeneral icon={LikeIcon} name='Улюблене' href='/' />
      </Breadcrumbs>
    </header>
  )
}

export default FavoritesHeader
