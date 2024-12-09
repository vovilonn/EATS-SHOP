import { FC } from 'react'

import Breadcrumbs from '@/shared/components/ui/breadcrumbs'
import BreadcrumbBack from '@/shared/components/ui/breadcrumbs/components/breadcrumb-back'
import BreadcrumbGeneral from '@/shared/components/ui/breadcrumbs/components/breadcrumb-general'

import ProfileIcon from '@/shared/assets/icons/profile-icon.svg'

import style from './style.module.scss'
import {useRouter} from "next/router";

const ProfileHeader: FC = () => {
  const { back } = useRouter();

  return (
    <header className={style.header}>
      <Breadcrumbs>
        <BreadcrumbBack onClick={back} />
        <BreadcrumbGeneral icon={ProfileIcon} name='Профіль' href='/profile' />
      </Breadcrumbs>
    </header>
  )
}

export default ProfileHeader
