import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'
import BreadcrumbName from '@/shared/components/ui/breadcrumbs/components/breadcrumb-name'

import ProfileIcon from '@/shared/assets/icons/profile-icon.svg'
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg'

import style from './style.module.scss'
import {useRouter} from "next/router";

const AchievementsHeader: FC = () => {
  const { back } = useRouter();

  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack onClick={back} />
        <BreadcrumbGeneral icon={ProfileIcon} name='Профіль' href='/profile' />
        <ArrowRightIcon />
        <BreadcrumbName name='Досягнення' />
      </Breadcrumbs>
    </header>
  )
}

export default AchievementsHeader
