import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import ProfileCard from '@/shared/components/profile-card'
import ProfileNavigation from './components/navigation'

import ProfileHeader from './components/header'

import style from './style.module.scss'
import Footer from '@/shared/components/footer'

const ProfilePageContent: FC = () => {
  return (
    <LoggedLayout>
      <ProfileHeader />

      <section className={style.row}>
        <ProfileCard />
        <ProfileNavigation />
      </section>
      <Footer />
    </LoggedLayout>
  )
}

export default ProfilePageContent
