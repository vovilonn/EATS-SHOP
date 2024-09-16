import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import ProfileCard from '@/shared/components/profile-card'
import ProfileNavigation from './components/navigation'

import ProfileHeader from './components/header'

import style from './style.module.scss'

const ProfilePageContent: FC = () => {
  return (
    <LoggedLayout>
      <ProfileHeader />

      <section className={style.row}>
        <ProfileCard />
        <ProfileNavigation />
      </section>
    </LoggedLayout>
  )
}

export default ProfilePageContent
