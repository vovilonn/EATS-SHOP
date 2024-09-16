import { FC } from 'react'

import Image from 'next/image'

import style from './style.module.scss'

interface IAchievementsAchievementCardProps {
  active?: boolean
  progress: number
}

const AchievementsAchievementCard: FC<
  IAchievementsAchievementCardProps
> = props => {
  return (
    <article className={style.card}>
      {!props.active && (
        <div className={style.progress}>
          <svg
            className={style.circle}
            width='120px'
            height='120px'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle className={style.back} cx='60' cy='60' r='50'></circle>
            <circle
              className={style.prog}
              style={{
                strokeDasharray: (props.progress * (3.15 * 100)) / 100 + ' 999',
              }}
              cx='60'
              cy='60'
              r='50'
            ></circle>
          </svg>
          <p className={style.text}>{(props.progress / 100) * 100 + '%'}</p>
        </div>
      )}
      {props.active && (
        <Image
          width='120'
          height='120'
          src='https://iili.io/dwFwq8P.jpg'
          alt='achievement image'
        />
      )}

      <h1 className={style.title}>Новачок</h1>
    </article>
  )
}

export default AchievementsAchievementCard
