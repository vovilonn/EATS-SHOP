import { FC, useState } from 'react'

import Title from '@/shared/components/title'
import Button from '@/shared/components/ui/button'

import InfoIcon from '@/shared/assets/icons/info-icon.svg'

import style from './style.module.scss'

const FriendsAction: FC = () => {
  const [hasShowedInfo, setShowedInfo] = useState<boolean>(false)

  return (
    <div className={style.wraper}>
      <div className={style.list}>
        <div className={style.items}>
          <div className={style.item}>
            <p className={style.text}>
              Загалом <br /> накопичено:
            </p>
            <Title className={style.title}>696,4 грн</Title>
          </div>
          <div className={style.item}>
            <p className={style.text}>
              Загалом <br /> запрошених друзів:
            </p>
            <Title className={style.title}>12</Title>
          </div>
        </div>
        <div className={style.ref}>
          <Title className={style.title}>Реферальний код:</Title>
          <div className={style.codeWraper}>
            <p className={style.code}>r84z9a5</p>
            <span
              className={style.icon}
              onClick={() => setShowedInfo(prev => !prev)}
            >
              <InfoIcon />
            </span>
          </div>
        </div>
        {hasShowedInfo && (
          <p className={style.text}>
            Запроси свого друга в додаток та отримай +50 грн на свій eats
            гаманець. Також ти додатково отримуєш 0,5% від суми його першого
            замовлення. Тож гайда ділись додатком!
          </p>
        )}
      </div>
      <Button className={style.btn} basket>
        Поділитися
      </Button>
    </div>
  )
}

export default FriendsAction
