import { FC } from 'react'

import CheckedIcon from '@/shared/assets/icons/checked-icon.svg'

import style from './style.module.scss'

const NotificationProductAdded: FC = () => {
  return (
    <div className={style.added}>
      <span className={style.icon}>
        <CheckedIcon />
      </span>
      <p className={style.text}>Товар додано до кошика</p>
    </div>
  )
}

export default NotificationProductAdded
