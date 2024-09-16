import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import ProfileCard from '@/shared/components/profile-card'
import PersonalInfoHeader from './components/header'
import PersonalInfoUpdate from './components/update'

import style from './style.module.scss'

const PersonalInfoPageContent: FC = () => {
  return (
    <LoggedLayout>
      <PersonalInfoHeader />

      <section className={style.row}>
        <ProfileCard />
        <PersonalInfoUpdate />
      </section>
    </LoggedLayout>
  )
}

export default PersonalInfoPageContent
