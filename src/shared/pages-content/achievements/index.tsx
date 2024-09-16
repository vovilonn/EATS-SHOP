import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import AchievementsHeader from './components/header'
import AchievementsAchievementCard from './components/achievement-card'

import style from './style.module.scss'

const AchievementsPageContent: FC = () => {
  return (
    <LoggedLayout>
      <AchievementsHeader />

      <section className={style.wraper}>
        <AchievementsAchievementCard progress={10} active />
        <AchievementsAchievementCard progress={15} />
        <AchievementsAchievementCard progress={60} />
        <AchievementsAchievementCard progress={30} />
      </section>
    </LoggedLayout>
  )
}

export default AchievementsPageContent
