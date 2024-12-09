import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'

import LikeIcon from '@/shared/assets/icons/like-icon.svg'

import style from './style.module.scss'
import {useRouter} from "next/router";

const FavoritesHeader: FC = () => {
  const { back } = useRouter();

  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack onClick={back} />
        <BreadcrumbGeneral icon={LikeIcon} name='Улюблене' href='/' />
      </Breadcrumbs>
    </header>
  )
}

export default FavoritesHeader
