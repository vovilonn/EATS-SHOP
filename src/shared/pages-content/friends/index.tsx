import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import FriendsHeader from './components/header'
import FriendsFriendList from './components/friend-list'
import FriendsAction from './components/action'

import style from './style.module.scss'

const FriendsPageContent: FC = () => {
  return (
    <LoggedLayout>
      <FriendsHeader />

      <section className={style.wraper}>
        <FriendsAction />
        <FriendsFriendList />
      </section>
    </LoggedLayout>
  )
}

export default FriendsPageContent
