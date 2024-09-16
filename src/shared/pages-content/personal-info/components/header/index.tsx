import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'

import ProfileIcon from '@/shared/assets/icons/profile-icon.svg'
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg'

import style from './style.module.scss'
import BreadcrumbName from '@/shared/components/ui/breadcrumbs/components/breadcrumb-name'

const PersonalInfoHeader: FC = () => {
  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack href='/' />
        <BreadcrumbGeneral icon={ProfileIcon} name='Профіль' href='/' />
        <ArrowRightIcon />
        <BreadcrumbName name='Особиста інформація' />
      </Breadcrumbs>
    </header>
  )
}

export default PersonalInfoHeader
